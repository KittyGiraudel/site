---
title: Six months of Rust
tags:
  - posts
  - Rust
  - Retrospective
---

For the past {% footnoteref "timeline" "It’s actually been 8 months, but “six months” makes for a better title." %}~~6~~ 8 months{% endfootnoteref %}, I have been learning [Rust](https://rust-lang.org/). This article is a brain dump of my experience with the language, what I like and don’t like, and other miscellaneous thoughts. This is written from the perspective of a long-time JavaScript/TypeScript engineer coming to Rust for a real production system.

- [Overview](#overview)
- [You Cargo girl!](#you-cargo-girl)
- [Embracing the compiler](#embracing-the-compiler)
- [Error handling done right](#error-handling-done-right)
- [Locks and deadlocks](#locks-and-deadlocks)
- [What’s next?](#whats-next)

## Overview

In summer 2025, I started supporting a friend with the server of their mobile game, following the departure of their previous backend engineer. The stack is quite straightforward: a Rust program running on a single powerful machine, with a MongoDB database. Game clients connect via websockets.

Now, it’s important to point out that my background is primarily in frontend. I have done some PHP during my studies back in 2010, and then a lot of Node.js throughout my career. I am by no means experienced with backend technology.

Which means I have (and still do) relied a lot on AI coding agents to support me in my work. I would never have been able to pick up Rust that easily, let alone actually bring value to the system, without Cursor. 

## You Cargo girl!

Cargo is Rust’s build system and package manager. It’s responsible for compiling your code, as well as installing dependencies. And let me tell you: it Just Works™. It’s incredibly stable, generally fast, and never disappoints. From installing dependencies to compiling the code to using workspaces, everything just works out of the box and without a hiccup. Very refreshing.

The JavaScript ecosystem is often the butt of the joke, with its multiple runtimes (Node.js and deno and Bun), various package managers (npm and pnpm and yarn), many flavours (CJS and UMD and ESM) and {% footnoteref "dependencies" "I’ve noticed there seem to be far less fragmentation of packages (“crates” as they are called) with similar purposes. It could be because Rust doesn’t have the same ecosystem depth as npm, or just that there is less bikeshedding and rebuilding in the Rust community — not sure." %}countless dependencies{% endfootnoteref %}… And while you learn how to navigate them, it’s always a pain and a time sink.

There are some old JavaScript projects I just don’t touch anymore, not because I’m bored of them, but because I know I’ll need to spend half a day updating 10 different major dependencies and fighting with CJS/ESM compatibility and life is just too short for this shit.

{% info %}Side note: Cargo uses [TOML](https://toml.io/en/) as a configuration format and it’s just so much better than JSON. I understand that JavaScript uses JSON because the language had first-class support for it, but it’s a terrible format for configuration purposes.
{% endinfo %}

## Embracing the compiler

The first thing that struck me with Rust is that the compiler is *very picky*. Coming from JavaScript where basically anything goes (even with TypeScript which remains quite loose), it was a bit of a wall for me.

### Compilation errors

At first, every line I attempted to change faced me with some kind of error, usually a borrow/lifetime issue. Fortunately, error messages are exceptionally clear, with a stack trace, an error code, a human-friendly explanation, a fix suggestion and a link to the documentation. It’s such a refreshing change after `undefined is not a function`.

```sh
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0382]: borrow of moved value: `s1`
 --> src/main.rs:5:16
  |
2 |     let s1 = String::from("hello");
  |         -- move occurs because `s1` has type `String`, which does not implement the `Copy` trait
3 |     let s2 = s1;
  |              -- value moved here
4 |
5 |     println!("{s1}, world!");
  |                ^^ value borrowed here after move
  |
  = note: this error originates in the macro `$crate::format_args_nl` which comes from the expansion of the macro `println` (in Nightly builds, run with -Z macro-backtrace for more info)
help: consider cloning the value if the performance cost is acceptable
  |
3 |     let s2 = s1.clone();
  |                ++++++++

For more information about this error, try `rustc --explain E0382`.
error: could not compile `ownership` (bin "ownership") due to 1 previous error
```

Still, it can be tricky to understand ownership if you have no experience with that concept whatsoever. The string type is also quite complicated compared to other languages I’ve worked with: there is the mutable `String` and the literal `&str`, and which to use and how to convert can be a little unintuitive at first.

On the bright side, if the code ever compiles, then it most likely runs. Runtime failures basically can’t really happen, so this was extremely comforting. Knowing that if the code can be compiled and deployed, it will surely run just fine (safe of logic problems) was a great confidence boost in actually getting things done.

### Compilation time

I suppose the price to pay to get such a good compiler is time. Every check that’s shifted left at compilation time adds to, well, compilation time. Our server is relatively small, and our machine is quite powerful, and it can still take several minutes to do a clean build with 8 vCPUs. I can only imagine how long it takes to compile very large Rust applications with many dependencies.

I think I properly realised that when setting up a test server for us. I purchased a rather cheap machine since that server would have essentially no traffic. But when it came to actually compiling and deploying the Rust binary (which happens a lot for testing purposes), it would take 5–10 minutes. That’s because the machine I bought had only 2 vCPUs, so compilation could not be parallelized efficiently.

## Error handling done right

To begin with, Rust differentiates between “recoverable” and “unrecoverable” errors. This is a very important distinction, as it suggests there are natural errors (or cases) that the program should handle (like a record not being found in the database), and more problematic errors that are symptomatic of actual bugs (like accessing a location beyond the end of an array).

Rust doesn’t have exceptions, it has the `Result<T, E>` type for recoverable errors. This enum has 2 variants: `Ok` and `Err`. The `Ok` variant indicates the operation was successful, and it contains the successfully generated value. The `Err` variant means the operation failed, and it contains information about how or why the operation failed. From there, we can use the pattern matching (with `match`) to conditionally handle the error.

In the following example, the `File::open(..)` function returns a `Result` enum, containing the file handle if it worked, or an error if it didn’t (for instance if the file is missing).

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
  let greeting_file = match File::open("hello.txt") {
    Ok(file) => file,
    Err(error) => match error.kind() {
      ErrorKind::NotFound => match File::create("hello.txt") {
        Ok(file_created) => file_created,
        Err(e) => panic!("Problem creating the file: {e:?}"),
      },
      _ => {
        panic!("Problem opening the file: {error:?}");
      }
    },
  };
}
```

In TypeScript, we’d do something like this (which I find to be “harder” to write and less readable):

```ts
import { readFile, writeFile } from "node:fs/promises"

async function main() {
  try {
    let greetingFile = await readFile("hello.txt", "utf8")
    // Do something with the content
  } catch (readError: unknown) {
    if ((readError as any)?.code === "ENOENT") {
      try {
        await writeFile("hello.txt", "")
      } catch (writeError) {
        throw new Error(`Problem creating the file: ${String(writeError)}`)
      }
    } else {
      throw new Error(`Problem opening the file: ${String(readError)}`)
    }
  }
}
```

Time and time again, I realise how elegant error management is in Rust. Between the `Result` enum that encapsulates either outcomes, the `match` keyword, the `?` operator shortcut for error propagation, and more… It’s just very well thought out, and it makes complex programs convenient and *readable*.

## Locks and deadlocks

Now, *that* has been my nemesis. Rust has strong concurrency primitives. And because of that, it needs data structures that can guarantee consistency across multiple threads. There are a couple of them (namely `RwLock` for “read-write lock” and `Mutex` for “mutual exclusion”), and they rely on a *lock*, which *guards* the data it holds and limits access to a single thread at a time. The [Rust book has a good metaphor](https://doc.rust-lang.org/book/ch16-03-shared-state.html) for it:

> For a real-world metaphor for a mutex, imagine a panel discussion at a conference with only one microphone. Before a panelist can speak, they have to ask or signal that they want to use the microphone. When they get the microphone, they can talk for as long as they want to and then hand the microphone to the next panelist who requests to speak. If a panelist forgets to hand the microphone off when they’re finished with it, no one else is able to speak. If management of the shared microphone goes wrong, the panel won’t work as planned!

The problem with these data structures, however necessary they may be, is that you have the potential to put the runtime in a *deadlock*. In its simplest form, this can happen when:
1. Thread A acquires the write lock of a data structure. This blocks all read attempts until the lock is released.
2. Thread B attempts to acquire the read lock of the same data structure. It’s paused until the write lock is released.
3. Thread A waits on thread B for any reason (for instance to acquire another lock held by thread B).

In that case, thread A will hold the write lock for as long as it needs, and if it waits on a second thread that is itself waiting on the lock, both threads will end up in an unrecoverable deadlock. It’s not always a textbook ‘two locks, two threads’ deadlock, but the end result is the same: no progress and a hung server.

This can absolutely bring your runtime to its knees and {% footnoteref "watchdog" "I have written a rather long article about <a href='/2026/02/09/rust-watchdog/'>authoring a watchdog to recover from deadlocks</a>. Check it out, it’s good stuff!" %}make your server hang{% endfootnoteref %}, rendering it essentially broken even though it actually runs.

Now here is the thing: I know this is a skill issue. This is probably a problem that very experienced programmers no longer face because they have achieved the nirvana of thread-safe concurrency. But for anyone learning Rust on anything non-trivial, this can be a real ass-biting moment.

## What’s next?

More Rust! To be honest, I could see myself pick it as a language of choice for a production backend project. It’s definitely a mature and performant language, with incredible developer experience, and a vibrant community.

I guess it depends a lot on the project. After all, I’m still much more comfortable with TypeScript, but I’ve also written JS my entire career. So if like me you’re coming from JS/TS and would like to try Rust, start with small CLI tools or glue code before jumping into a heavily concurrent server. The compiler will teach you a lot, but locks and deadlocks are still a separate boss fight. 
