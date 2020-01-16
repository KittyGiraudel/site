---
guest: "Loïc Giraudel"
title: "Optimizing images with Bash script"
tags:
  - bash
  - script
  - images
  - optimisation
---

> The following is a guest post by [Loïc Giraudel](https://twitter.com/l_giraudel). Loïc is a JavaScript and Git expert at BestOfMedia (Grenoble, France) and in a lesser extend my brother. He also knows his way in Bash scripting and front-end performance. I’m very glad to have him writing here. :)

You can’t talk about front-end performance without talking about images. They are the heaviest component of a webpage. This is why it is important to optimize images before pushing things live.

So let’s try a not-so-easy exercise: write a script to optimize a directory of images. Yup, I know there are a lot of web services offering this kind of feature but:

* most of them can’t optimize several files at once,
* it’s not quite simple to use it in an industrial process,
* it’s always interesting to learn how those services work.

> Shell scripting is a powerful skill to improve development efficiency by automating common tasks.

But first, a simple warning: don’t expect big optimizations. To have the best results, you have to decrease the image quality but it’s better to do this manually than automatically. We are going to script simple operations that remove metadata and other losslessly informations.

I’m working on Linux environment so this script will be a Bash script. Don’t worry! I will start with an introduction to Bash scripting in a Windows environment.

Bash is the GNU shell and the most common shell in Unix/Linux environment. A shell is a command-line interpreter allowing to access to all the functionalities of the OS. Shell scripting is a powerful skill to improve development efficiency by automating common tasks like building a project and deploying it.

## Use Linux flavour in Windows

To be able to run Linux scripts on Windows, there are two methods:

1. use a Virtual Machine with a Linux distribution on it,
1. use a Linux simulator.

Since it can be quite a pain to set up a virtual machine, we will go for the latter with [Cygwin](http://www.cygwin.com/). Cygwin is a Linux simulator. Go to the [download section](http://cygwin.com/install.html), grab the `setup.exe` file and execute it to launch the installer. You can leave all settings by default until you get to the step asking you which packages to install.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/cygwin.png" alt="" />
<figcaption><a href="http://www.cygwin.com/">Cygwin</a> is a Linux simulator</figcaption>
</figure>

To add a package, click on the _"Skip"_ label to switch it to a package version. Search for the following packages and add them (clicking on _"Skip"_ is enough):

* optipng
* pngcrush
* jpeg
* util-linux

Once Cygwin is fully installed, simply open a Cygwin terminal. Let’s create a workspace to host our optimization script: we create a _"workspace"_ directory in the current user home:

```bash
# Create the workspace folder
mkdir workspace
# Enter the workspace folder
cd workspace
```

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/workspace.png" alt="" />
<figcaption>Creating a workspace in Cygwin</figcaption>
</figure>

By default, Cygwin is installed at `C:/cygwin/` so our new directory is at `C:/cygwin/home/[username]/workspace` (where `[username]` is your username). Let’s create a _"images"_ directory and fill it with some random images from the wild wild web (you can do this manually). For this exercise, we are going to take cat pictures because, you know, everybody love cats.

## Optimizing an image with the command line

For each file, our script is going to run _optipng_ and _pngcrush_ for PNG files and _jpegtran_ for JPG files. Before going any further and start writing the script, let’s make a first try with all of these tools starting with _optipng_:

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/optipng.png" alt="" />
<figcaption>PNG optimization with <a href="http://optipng.sourceforge.net/">optipng</a></figcaption>
</figure>

_Note: the -o7 parameter force optipng to use the slowest mode. The fastest is -o0._

Then _pngcrush_:

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/pngcrush.png" alt="" />
<figcaption>PNG optimization with <a href="http://pmt.sourceforge.net/pngcrush/">pngcrush</a></figcaption>
</figure>

And now a JPG optimization with _jpegtran_:

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/jpegtran.png" alt="" />
<figcaption>JPG optimization with <a href="http://jpegclub.org/">jpegtran</a></figcaption>
</figure>

## Building the script

You’ll find the whole script at the end of the article. If you want to try things as we go through all of this, you can save it (`optimize.sh`) now from [this GitHub gist](https://gist.github.com/lgiraudel/6065155).

### Options parsing

As obvious as it can be, our script needs some parameters:

* `-i` or `--input` to specify an input directory
* `-o` or `--output` to specify an output directory
* `-q` or `--quiet` to disable verbose output
* `-s` or `--no-stats` to disable the output of stats after the run
* `-h` or `--help` to display some help

There is a common pattern to parse script options, based on the `getopt` command. First, we create two variables to store both the short and long version of each parameter. A parameter which requires a specific value (for example our input and output directories) must end with ":".

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/options.png" alt="" />
<figcaption>Bash script options</figcaption>
</figure>

Then we are going to use the `getopt` command to parse the parameters passed to script and use a loop to call functions or define variables to store values. For this, we will also need to know the script name.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/options-loop.png" alt="" />
<figcaption>Parsing our options within a loop</figcaption>
</figure>

### Help function

Now, we have to create two functions:

* the `usage()` function, called in the parameters loop if there is a `-h` or `--help` parameter,
* a `main()` function which will do the optimization of the images.

To be called, the functions must be declared before the parameters loop.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/usage.png" alt="" />
<figcaption>The help function</figcaption>
</figure>

Let’s try our help function. To be able to run the script, we have to add execution mode (+x) on it with the command `chmod`.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/usage-try.png" alt="" />
<figcaption>Help function</figcaption>
</figure>

Pretty cool, isn’t it ?

_Note, if you get a couple of errors like "./optimize.sh: line 2: $'\r' : command not found", you have to turn line endings in Unix mode. To do so, open `optimize.sh` in Sublime Text 2 and go to View > Line endings > Unix._

### Main function

And now, let’s create the main function. We won’t deal with `--no-stats` and `--quiet` parameters for now. Below is the skeleton of our main function; it might looks complicated but it’s really not trust me.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/main.png" alt="" />
<figcaption>The main function of our script</figcaption>
</figure>

So our main function starts by initializing both input and output directories with passed parameters; if left empty we take the current folder as input and create an _output_ folder in the current one (thanks to the `mkdir` command once again).

_The `-p` parameter of the `mkdir` command forces the creation of all intermediate directories if they are missing._

Once the input and output are ready, there is a little trick to deal with files containing spaces. Let’s say I have a file named _"soft kitty warm kitty.png"_ (little ball of fur, anyone?), the loop will split this into 4 elements which will obviously lead to errors. To prevent this from happening, we can change the Internal File Separator (which is a space character by default) to set an end-of-line character. We will restore the original IFS at the end of the loop.

The image files are retrieved with the `find` command, which accepts a regular expression as parameter. If the output directory is a subdirectory of input directory (which is the case if we don’t specify any of both) and if the output directory is not empty, we don’t want to process images from here so we skip filepaths which contain the output directory path. We do this with the `grep -v $OUTPUT` command.

And then, we loop through the files and call an `optimize_image` function with two parameters: the input and output filename for the image.

Now, we have to create this `optimize_image()` method which is going to be fairly easy since we already have seen the command to optimize images before.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/optimize-image.png" alt="" />
<figcaption>The actual image optimization function</figcaption>
</figure>

### Output informations

Let’s add some useful output to see progress and the final stats. What about something like this:

```bash
file1 ...................... [ DONE ]
file2 ...................... [ DONE ]
file_with_a_long_name ...... [ DONE ]
…
```

Would be neat, wouldn’t it? To do this, we first need to find the longest filename by doing a fast loop on the files.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/get-max-file-length.png" alt="" />
<figcaption>Function to retrieve the longest filename</figcaption>
</figure>

Then before our main loop, we:

1. retrieve the length of the longest filename
1. create a very long string of dots (_"."_)
1. set a max line length equals to the length of the longest filename + the length of our _" [ DONE ]"_ string (9 characters) + a small number (5 here) to have some space between the longest name and the _" [ DONE ]"_ string.

Finally, in the main loop we display the filename then the _"."_ symbols and the the _" [ DONE ]"_ string.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/output.png" alt="" />
<figcaption>Script handling the output</figcaption>
</figure>

Let’s try it by running the following command:

```bash
# All parameters to default
./optimize.sh
# Or with custom options
./optimize.sh --input images --output optimized-images
# Or with custom options and shorthand
./optimize.sh -i images -o optimized-images
```

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/output-console.png" alt="" />
<figcaption>Testing the output</figcaption>
</figure>

### Final stats

For the final stats we are going to display the amount of space saved. The `optimize_image()</code> method will increase a`total_input_size`with the filesize of the image to optimize, and a`total_output_size` with the filesize of the output image. At the end of the loop, we will use this two counters to display the stats.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/optimize-image-with-stats.png" alt="" />
<figcaption>Adding stats output in optimize_image()</figcaption>
</figure>

To display human readable numbers, we can use a `human_readable_filesize()` method, retrieved from [StackExchange](https://unix.stackexchange.com/questions/44040/a-standard-tool-to-convert-a-byte-count-into-human-kib-mib-etc-like-du-ls1) (let’s not reinvent the wheel, shall we?).

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/display-stats.png" alt="" />
<figcaption>A function to display human readable stats</figcaption>
</figure>

Let’s try it before adding the last bites to our code. Once again, we simply run `./optimize.sh` (or with additional parameters if needed).

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/output-with-stats.png" alt="" />
<figcaption>Outputing optimization stats</figcaption>
</figure>

Keep it up people, we are almost done! We just have to display progress output if the quiet mode is off.

<figure class="figure">
<img src="/assets/images/optimizing-with-bash/quiet-mode.png" alt="" />
<figcaption>Quiet mode</figcaption>
</figure>

## Final result

Below lies the final script or you can grab it directly from [this GitHub gist](https://gist.github.com/lgiraudel/6065155).

```bash
#!/bin/bash

PROGNAME=${0##*/}
INPUT=''
QUIET='0'
NOSTATS='0'
max_input_size=0
max_output_size=0

usage()
{
  cat <<EO
Usage: $PROGNAME [options]

Script to optimize JPG and PNG images in a directory.

Options:
EO
cat <<EO | column -s\& -t
	-h, --help  	   & shows this help
	-q, --quiet 	   & disables output
	-i, --input [dir]  & specify input directory (current directory by default)
	-o, --output [dir] & specify output directory ("output" by default)
	-ns, --no-stats    & no stats at the end
EO
}

# $1: input image
# $2: output image
optimize_image()
{
	input_file_size=$(stat -c%s "$1")
	max_input_size=$(expr $max_input_size + $input_file_size)

	if [ "${1##*.}" = "png" ]; then
		optipng -o1 -clobber -quiet $1 -out $2
		pngcrush -q -rem alla -reduce $1 $2 &gt;/dev/null
	fi
	if [ "${1##*.}" = "jpg" -o "${1##*.}" = "jpeg" ]; then
		jpegtran -copy none -progressive $1 &gt; $2
	fi

	output_file_size=$(stat -c%s "$2")
	max_output_size=$(expr $max_output_size + $output_file_size)
}

get_max_file_length()
{
	local maxlength=0

	IMAGES=$(find $INPUT -regextype posix-extended -regex '.*\.(jpg|jpeg|png)' | grep -v $OUTPUT)

	for CURRENT_IMAGE in $IMAGES; do
		filename=$(basename "$CURRENT_IMAGE")
		if [[ ${#filename} -gt $maxlength ]]; then
			maxlength=${#filename}
		fi
	done

	echo "$maxlength"
}

main()
{
	# If $INPUT is empty, then we use current directory
	if [[ "$INPUT" == "" ]]; then
		INPUT=$(pwd)
	fi

	# If $OUTPUT is empty, then we use the directory "output" in the current directory
	if [[ "$OUTPUT" == "" ]]; then
		OUTPUT=$(pwd)/output
	fi

	# We create the output directory
	mkdir -p $OUTPUT

	# To avoid some troubles with filename with spaces, we store the current IFS (Internal File Separator)…
	SAVEIFS=$IFS
	# …and we set a new one
	IFS=$(echo -en "\n\b")

	max_filelength=`get_max_file_length`
	pad=$(printf '%0.1s' "."{1..600})
	sDone=' [ DONE ]'
	linelength=$(expr $max_filelength + ${#sDone} + 5)

	# Search of all jpg/jpeg/png in $INPUT
	# We remove images from $OUTPUT if $OUTPUT is a subdirectory of $INPUT
	IMAGES=$(find $INPUT -regextype posix-extended -regex '.*\.(jpg|jpeg|png)' | grep -v $OUTPUT)

	if [ "$QUIET" == "0" ]; then
		echo &ndash;&ndash;&ndash; Optimizing $INPUT &ndash;&ndash;&ndash;
		echo
	fi
	for CURRENT_IMAGE in $IMAGES; do
		filename=$(basename $CURRENT_IMAGE)
		if [ "$QUIET" == "0" ]; then
		    printf '%s ' "$filename"
		    printf '%*.*s' 0 $((linelength - ${#filename} - ${#sDone} )) "$pad"
		fi

		optimize_image $CURRENT_IMAGE $OUTPUT/$filename

		if [ "$QUIET" == "0" ]; then
		    printf '%s\n' "$sDone"
		fi
	done

	# we restore the saved IFS
	IFS=$SAVEIFS

	if [ "$NOSTATS" == "0" -a "$QUIET" == "0" ]; then
		echo
		echo "Input: " $(human_readable_filesize $max_input_size)
		echo "Output: " $(human_readable_filesize $max_output_size)
		space_saved=$(expr $max_input_size - $max_output_size)
		echo "Space save: " $(human_readable_filesize $space_saved)
	fi
}

human_readable_filesize()
{
echo -n $1 | awk 'function human(x) {
     s=" b  Kb Mb Gb Tb"
     while (x>=1024 && length(s)>1)
           {x/=1024; s=substr(s,4)}
     s=substr(s,1,4)
     xf=(s==" b ")?"%5d   ":"%.2f"
     return sprintf( xf"%s", x, s)
  }
  {gsub(/^[0-9]+/, human($1)); print}'
}

SHORTOPTS="h,i:,o:,q,s"
LONGOPTS="help,input:,output:,quiet,no-stats"
ARGS=$(getopt -s bash --options $SHORTOPTS --longoptions $LONGOPTS --name $PROGNAME -- "$@")

eval set -- "$ARGS"
while true; do
	case $1 in
		-h|--help)
			usage
			exit 0
			;;
		-i|--input)
			shift
			INPUT=$1
			;;
		-o|--output)
			shift
			OUTPUT=$1
			;;
		-q|--quiet)
			QUIET='1'
			;;
		-s|--no-stats)
			NOSTATS='1'
			;;
		--)
			shift
			break
			;;
		*)
			shift
			break
			;;
	esac
	shift
done

main
```

## What now ?

Of course this is just a simple sample (no pun intended); there is still a lot of room for improvements. Here is a couple of things we could do to improve it:

* add GIF support,
* use other tools to optimize JPG and PNG in the `optimize_image` method (by the way, I highly recommand you to read [this great article](https://www.phpied.com/big-list-image-optimization-tools) by Stoyan Stefanov),
* add a progress bar,
* try to add some lossy optimizations for JPG,
* add an auto-upload function to upload to your FTP,
* use a configuration file to tweak the optimization tools…

> Loïc Giraudel works as a front-end developer at BestOfMedia (Grenoble, France). He is a JavaScript and Git expert. You can catch him on Twitter: [@l_giraudel](https://twitter.com/l_giraudel).
