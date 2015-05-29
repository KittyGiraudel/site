---
layout: post
title: "String replacement function in Sass"
tags:
  - sass
  - strings
  - replace
  - function
---

> **Edit (2014/11/16):** here is an [updated, more powerful version](http://sassmeister.com/gist/1b4f2da5527830088e4d).

The other day, I caught up a discussion on Twitter where famous French developer [Nicolas Hoffman asked for a way to replace a string into another string in Sass](https://twitter.com/Nico3333fr/status/420557471745179648). He quickly got some answers to dig into string functions coming in Sass 3.3, but I know playing around such tools can be quite time consuming for someone who's not like super comfortable with the syntax.

So I thought I'd give it ago. Since I managed to have a decent result in a matter of minutes and I really enjoyed working on this little thing, here is an explanation of [the code](http://sassmeister.com/gist/8300738).

## A quick leveling-up with string functions

We will need a couple of string functions that are not currently available in Sass but will in Sass 3.3 (which should be released in January according to [this post](https://gist.github.com/nex3/8050187) by Nex3).

* `str-length`: like `length` but for strings
* `str-slice`: slicing a string from index A to index B
* `str-insert`: insert a string in a string at index A`
* `str-index`: finds first occurence of string in string
* `to_lower_case`: move a whole string to lower case

You can find the Ruby source code for those functions in [this file](https://github.com/chriseppstein/sass/blob/string_functions/lib/sass/script/functions.rb). I don't do any Ruby, but the code is well documented so it's really easy to understand what's going on.

## Building the `str-replace` function

Let's start with the skeleton:

<pre class="language-scss"><code>@function str-replace($string, $old, $new) {
  // Doing magic
  @return $string;

}</code></pre>

First things first, we need to check if the `$string` actually contains `$old`. If it doesn't, well there is nothing we can do and we can do! For this, we'll use the `str-index` function which returns either the index at which the first occurrence of `$old` has been found starting or `0` if `$old` hasn't been found.

<pre class="language-scss"><code>@function str-replace($string, $old, $new) {
  $index: str-index($string, $old);
  @if $index > 0 and $new != $old {
    // Doing magic
  }
  @return $string;
}</code></pre>

Note how we also make sure the `$new` string is different from the `$old` one. Obviously there is nothing to replace if both are the same!
Now let's dig into the core of our function. The first thing we need to do is to remove the `$old` string from the `$string`. To do this, we don't have any other choice than recreating a new string by looping through each character of the string and not appending the one from `$old`. Because performance matters, we can start looping from `$index` instead of `1`.

<pre class="language-scss"><code>$new-string: quote(str-slice($string, 1, $index - 1));
@for $i from $index through str-length($string) {
  @if $i < $index or $i >= $index + str-length($old) {
    $new-string: $new-string + str-slice($string, $i, $i);
  }
}</code></pre>

So we start by initializing the `$new-string` with the beginning of the `$string`, from the first character to the one right before `$index` (the start of `$old`). Then we loop through each character in the string, and append them to the new string only if they are not part of the `$old` occurrence.

Now that we've remove the old string, we need to append the new one. Couldn't be easier with the `str-insert` function.

<pre class="language-scss"><code>$new-string: str-insert($new-string, $new, $index);</code></pre>

Done. Now what if there were multiple occurrences of `$old` in the string? The easiest way is to go recursive.

<pre class="language-scss"><code>@return str-replace($new-string, $old, $new);</code></pre>

The function will run once again. If `$old` is found again, then it will deal with it as we just did for the first occurrence and go recursive again until there is no more occurrence of `$old` in the string. And when there is none, we don't satisfy the `@if $index > 0` anymore so we just return `$string`. End of story.

## Dealing with errors

When you build such functions, it is always nice to handle edge cases like wrong arguments or things like this. You might know that the function requires a string for each argument to work but the end user might do something weird with it, like trying to replace a string by a number or something.

You usually put those kind of verifications at the top of the function in order to warn the user that something is wrong before doing anything else. Thankfully, Sass provides the `@warn` directive that allows you to display a message in the console. Beware, this directive doesn't prevent the function from running so you might want to couple it with a `@return`.

### Wrong arguments

<pre class="language-scss"><code>@function str-replace($string, $old, $new) {
  @if type-of($string) != string or type-of($old) != string or type-of($new) != string {
    @warn "One of the 3 arguments is not a string.";
    @return $string;
  }

  // Doing magic
}</code></pre>

### Infinite recursion

Because of the way we handle this function, we go recursive. That means if you include the `$old` string in the `$new` string, you can create an infinite loop and make the whole universe collapse. That wouldn't be pretty; let's warn the user.

<pre class="language-scss"><code>@function str-replace($string, $old, $new) {
  @if str-index($new, $old) != 0 {
    @warn "The string to be replaced is contained in the new string. Infinite recursion avoided.";
    @return $string;
  }

  // Doing magic
}</code></pre>

## Dealing with case sensitivity

Last thing we can do to make our function even better is dealing with giving a way to enable case sensitivity. Simplest way to do so is to add another parameter to the function, let's say a `$case-sensitive` boolean. Since `str-index` is case-sensitive by default, we'll set `$case-sensitive` to true.

What we could do to allow case insentivity (when `$case-sensitive` is set to `false`) is to turn both the `$old` and the `$string` into lower case (or uppercase, whatever) to see if it finds anything. To do so, we only have to change the `$index` assignment:

<pre class="language-scss"><code>$index: if(
  not $case-sensitive,
  str-index(to-lower-case($string), to-lower-case($old)),
  str-index($string, $old)
);</code></pre>

This doesn't change the initial string at all, it just performs a search without being case sensitive. Easy peasy!

## Final words

To be perfectly honest with you, I don't yet have a use-case for this but I am sure there will be. String replacement is kind of a key feature as soon as you start playing with strings so if you ever come up with the need to replace a string into another string by another another string; think of me and tell me what was the usecase. ;)
