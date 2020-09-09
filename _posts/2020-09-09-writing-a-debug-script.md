---
title: Writing a Debug Script
---

To help debugging situations and collaborating with others when we cannot sit together, I came up with a little Node “doctor” script (in hommage to `brew doctor`). The goal is to emit a lot of information about the system and working environment (git status, system, environment variables…) so the output can be shared with someone to compare with.

As you will see, there is quite a lot of information in there. And while most of it was relatively easy to access and display, some bits were trickier than I thought so, here we are.

- [Detecting internet connection](#detecting-internet-connection)
- [Detecting VPN access](#detecting-vpn-access)
- [Detecting Mac version](#detecting-mac-version)
- [Detecting nvm](#detecting-nvm)
- [Detecting last npm install](#detecting-last-npm-install)
- [Detecting whether Docker is running](#detecting-whether-docker-is-running)
- [Displaying some Git information](#displaying-some-git-information)

Without further ado, let me show you what the script outputs (without fancy colours, sorry):

```sh
===============================================================================
* System                                                                      *
===============================================================================
Operating System: Mac OS X 10.15.6
Distribution: darwin
CPUs: 12
Internet: true
VPN: none
→ Currently not on any VPN; consider connecting to the VPN.
Docker running: true

===============================================================================
* Node                                                                        *
===============================================================================
Version: v12.18.3
npm: 6.14.8
nvm: true
Env: development
Modules: 1523
Installed: 13 days ago
→ The last node_modules install is over a week old.
→ Consider reinstalling dependencies: `npm ci`.

===============================================================================
* Environment variables                                                       *
===============================================================================
HTTP port: 8080
Source maps: none
Webpack bundle analyzer: false
Webpack metrics: false
Node process inspect: false
Verbosity level: info
Memory cache: true
Local API: staging
Code instrumentation: false

===============================================================================
* Git                                                                         *
===============================================================================
Branch: doctor-script
Difference: 1
Last commit: Add a doctor script
Clean: false
```

## Detecting internet connection

Interestingly enough, there is no obvious way to check whether the machine has internet access from a Node script. A StackOverflow answer mentions that [performing a DNS lookup on a popular domain](https://stackoverflow.com/a/15271685) is likely the way to go.

```js
const hasInternetAccess = async () => {
  try {
    await promisify(require("dns").resolve)("www.google.com");
    return true;
  } catch {
    return false;
  }
};
```

Alternatively, Sindre Sorhus (no surprise there) has [a handy npm package called `is-online`](https://github.com/sindresorhus/is-online) which does essentially the same thing while being a bit more resilient to a single domain not being available.

## Detecting VPN access

This one has to be put in context: in the case of my team, the VPN grants us access to some APIs, so we tend to need to be connected to it in order to work. Therefore, I didn’t have to go too far here, and simply tried to ping our API domains. If it works, it means we’re on the VPN, otherwise we’re not. This is by no-mean a bulletproof solution to detect the presence of a VPN.

```js
const ping = async (url) => {
  try {
    await axios.get(url, {
      // This is necessary to circumvent a `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
      // Node.js error (at least in our case).
      // See: https://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    return true;
  } catch {
    return false;
  }
};

const onVPN = await ping("https://our.internal.api.domain");
```

## Detecting Mac version

You might be familiar with the [native `os` Node module](https://nodejs.org/api/os.html) which grants some insights onto the operating system details such as the platform, the amount of CPUs, and so on and so forth.

However, I wanted to detect the precise Mac version (e.g. Mac OS X 10.15.6) since we don’t all use the same. It turns out that this is not provided by the `os` module — the best we get is `darwin` as the platform. In another StackOverflow answer, I learnt that there is [a file on all Mac systems that contains basic information about the OS](https://stackoverflow.com/questions/14989081/node-js-to-get-determine-os-version).

If we could read that file, we could get the information we need. It turns out that we can definitely do that. It’s a `plist` file which I came to understand is a flavour of XML for Apple systems (I guess?). In my case, I had `xml2js` at the ready, but [the `plist` npm package](https://www.npmjs.com/package/plist) might be even better.

```js
const getMacOsVersion = async () => {
  const path = "/System/Library/CoreServices/SystemVersion.plist";
  const content = fs.readFileSync(path, "utf8");
  const { plist } = await xml2js.parseStringPromise(content);

  // Returns `Mac OS X` (at index 2) and `10.15.6` (at index 3)
  return plist.dict[0].string.slice(2, 4).join(" ");
};
```

For a more comprehensive solution, Sindre Sorhus happens to have a [package to get the Mac OS release](https://github.com/sindresorhus/macos-release) as well as [a package to get the OS name](https://github.com/sindresorhus/os-name/blob/master/index.js).

## Detecting nvm

To better manage our Node environment, we use [nvm](https://github.com/nvm-sh/nvm). As part of its documentation, nvm claims one can verify the installation worked properly by running `command -v nvm`.

Running this command should return `nvm` if it’s installed. And it does do that just fine, but when running it from within the script with `execSync` (from the `child_process` native module) I got a permission error for some reason.

After much searching, I found a StackOverflow answer that explains that [`nvm` is meant to be sourced](https://stackoverflow.com/a/43726209), which means it cannot be run programmatically from a script.

> `~/.nvm/nvm.sh` is not executable script, it is meant to be "sourced" (not run in a separate shell, but loaded and executed in the current shell context).

I had to change strategies, and decided to keep things simple by checking whether the `$NVM_DIR` environment variable — installed by nvm — was empty or not.

```js
const exec = (command) => cp.execSync(command).toString().trim();
const hasNvm = exec("echo $NVM_DIR") !== "";
```

## Detecting last npm install

Debugging a Node problem usually ends up with “I reinstalled my node_modules and now it works.” I was wondering if I could detect when was the last time Node modules were installed.

To do so, I thought I could check the creation date of any folder within the `node_modules` directory (here I use `react` because it’s one of our dependencies we’ll likely never get rid of). I initially thought I could check the `node_modules` folder itself, but it turns out it’s not removed when reinstalled modules, only emptied.

I have come to understand that this will not work on all operating systems, because it relies on the [timestamp at which a folder was created, which is not a standard](https://unix.stackexchange.com/questions/24441/get-file-created-creation-time).

```js
const getStats = promisify(require("fs").stat);
const stats = await getStats("./node_modules/react");
const lastInstall = moment(timestamp.birthtime);
const relative = lastInstall.fromNow(); // E.g. 3 days
```

From there, we can emit a gentle warning if the last install is over, say, a week old.

```js
if (moment().diff(lastInstall, "days") >= 7) {
  console.warn("The last node_modules install is over a week old.");
  console.warn("Consider reinstalling dependencies: `npm ci`.");
}
```

## Detecting whether Docker is running

There are probably more elegant checks we can do regarding Docker, but I wanted a quick way to figure out whether Docker was running in the background or not. The `docker version` command will only return a 0 exit code when effectively running, and a non-0 otherwise (not running or not installed).

```js
const isDockerRunning = () => {
  try {
    cp.execSync("docker version", { stdio: "ignore" });

    return true;
  } catch {
    return false;
  }
};
```

## Displaying some Git information

There are a few pieces of Git information we can display: which branch are we currently on, is it clean, how far is it from the main branch, and what is the last commit?

Finding the current branch is easy, as Git provides a way to get just that. To know whether this is clean, we can use the `--porcelaine` option (so sweet) of `git status`, which will return an empty string if clean.

```js
const branch = exec("git branch --show-current");
const clean = exec("git status --porcelain") === "";
```

Getting the amount of commits between the current branch and the main branch (in whichever way), is a little more tricky but can be done with `git log`. From there, we could emit a gentle warning if it looks quite far apart:

```js
const mainBranch =
const difference = Number(exec(`git log --oneline ${branch} ^${mainBranch} | wc -l`));
const threshold = 10;

if (difference > threshold) {
  console.warn(
    `The local branch (${branch}) is over ${threshold} commits apart (${difference}) from ${mainBranch}; consider rebasing.`
  );
}
```

Finally, grepping the last commit message can be done with `git log` as well:

```js
const lastCommit = exec("git log -1 --pretty=%B").trim();
```

## Wrapping up

I am sure there are many other details we could add to the script, and it will likely evolve across the next few weeks and months. Some ideas I played with but didn’t complete for not wanting to install more npm packages just for the sake of it:

- Display the current IP address.
- Detect whether the OS dark mode preference is enabled — [`node-dark-mode`](https://github.com/sindresorhus/node-dark-mode) from Sindre Sorhus does just that by interacting with the OS.
- Detect whether the camera is on with something like [`is-camera-on`](https://github.com/sindresorhus/is-camera-on) from you know who.

Nevertheless, that was a lot of fun to write and figure out. If it helped you or you have any suggestion, please get in touch on Twitter! :)
