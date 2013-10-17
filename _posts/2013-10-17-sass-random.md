---
title: Random function with Sass 3.3
layout: post
preview: false
comments: true
published: true
---
<section>
<p class="explanation">I wrote this article months ago when I was first experimenting with Sass 3.3 alpha features. I came up with a pretty crazy solution to generate a random number in Sass. However it looks like <a href="https://github.com/nex3/sass/pull/968">Sass 3.3 will implement a random function</a> so we won't need all this stuff. I still publish it for fun. :)</p>
<p>Everything started when I was spying on Sass 3.3 source code on GitHub for my article about the <a href="http://davidwalsh.name/future-sass">future of Sass</a> at David Walsh' Blog. I was sniffing the incoming functions when all of the sudden I came by a <code>unique-id()</code> function.</p>
<p>According to the <a href="https://github.com/nex3/sass/issues/771">issue</a> which started this idea, the <code>unique-id()</code> function should return a unique random alphanumeric identifier that could be used for whatever you like. As far as I understood the example provided by Chris Eppstein, it could be used to dynamically generate and extend a placeholder from within a mixin. Kind of complicated stuff, really.</p>
<p>Anyway, I saw this unique id thingie as an opportunity to have a random number with Sass. Why? I don't know. I leave this question to you. Maybe some day I'll find a usecase for a random number in CSS.</p>
<p class="note">Note: the code in this article has not been tested at all since it requires some Sass 3.3 functions that are not implemented yet. This is more like a proof of concept.</p>
</section>
<section id="unique-id">
<h2>About <code>unique-id()</code> <a href="#unique-id">#</a></h2>
<p>To understand what this is all about, you need to know what the <code>unique-id()</code> is and what it returns. First of all, there are two different functions for this i Sass source code, both from 2 months ago: <a href="https://github.com/nex3/sass/blob/f3be0f40b7c5072635b2d6dab772f2c29e8d629a/lib/sass/script/functions.rb#L1645">one in tree <code>f3be0f40b7</code></a> (using base36) and <a href="https://github.com/nex3/sass/blob/unique_id/lib/sass/script/functions.rb#L1645">one in branche <code>unique_id</code></a> (using base16). I only worked on the latter since it's most likely this is the one that will be implemented.</p>
<p>I'm not a Ruby pro, but with the help of a kind folk on Twitter, I could <a href='http://codepad.org/lojd8zLH'>make it work on CodePad</a>. Here is what a couple of run of the function looks like:</p>
<pre><code>u84ec5b4cdecd4299
u871ec9c6e6049323
u8865b8a8e572e4e8
u85f6c40bb775eff2
u8868f6a1f716d29f
u89cf1fa575a7a765
u89184d7511933cd3
u8a7287c699a82902
u8547f4133644af4c
u86fb16af4800d46b</code></pre>
<p>So the function returns a 19-characters long alphanumeric string. As you may have noticed, the returned string always starts with a <code>u</code>. This is actually hard-coded inside the function core to make sure the string always start with a letter in order to be able to be used as a class / placeholder / id, whatever.</p>
<p>To put it very simple, the function randoms a 19-digits number, convert it to base 16 (or base 36 in the other implementation), then append it a <code>u</code>. So when we use <code>unique-id()</code>, we end up with something like this: <code>u8547f4133644af4c</code>.</p>
</section>
<section id="rand-v1">
<h2>Random, the dirty way <a href="#rand-v1">#</a></h2>
<p>My first attempt to get a random number from this string was to remove all alpha characters from it, then keep only the number of digits we want (or we still have). To do this, I used the incoming string manipulation functions (<code>str-length()</code>, <code>str-slice()</code>, <code>str-insert()</code>):</p>
<pre class="language-scss"><code>@function rand($digits: 16) {
    /* Array of characters to remove */
    $letters : a b c d e f u;
    $result  : unquote("");
    $string  : unique-id();

    /* For each character in the given string */
    @for $i from 1 through str-length($string) {
        /* Isolate character */
        $character: str-slice($string, $i, $i + 1);
        /* If not a letter */
        @if index($character, $letters) == false {
            /* Append it to $value */
            $value: str-insert($result, $character, str-length($result) + 1);
        }
    }

    /* Deal with the number of digits asked */
    @if $digits !== 0 and $digits < length($result) {
      $result: str-slice($result, 1, $digits);
    }

    /* Return the result */
    @return $result;
}</code></pre>
<p>I think the code is pretty much self-explanatory. I check each character individually: if it's not a letter, I append it to the <code>$result</code> variable. When I'm done, if the length of <code>$result</code> is still greater than the number of digits we asked for (<code>$digits</code>) we truncate it.</p>
<p>And there we have a random number between 1 and 9999999999999999 (in case the 16 characters are 9).</p>
<pre class="language-scss"><code>$number: rand();   /* Random between 1 and 9999999999999999 */
$number: rand(1);  /* Random between 1 and 9 */
$number: rand(4);  /* Random between 1 and 9999 */
$number: rand(0);  /* Random between 1 and 9999999999999999 */
$number: rand(-1); /* Random between 1 and 9999999999999999 */
</code></pre>
</section>
<section id="rand-v2">
<h2>Random, the clean way <a href="#rand-v2">#</a></h2>
<p>Okay, let's say it: the first version I came with is really dirty. That's why I reworked a new version from scratch with the help of <a href="https://twitter.com/l_giraudel">my brother</a>. We even tweaked it in order to make it <em>future-proof</em> for both implementations of the <code>unique-id()</code> function. How cool is that?</p>
<p>To put it simple, instead of stripping alpha characters, we take the alphanumeric string and convert it back into an integer. Then, we get a fully random integer we simply have to manipulate around min and max values.</p>
<pre class="language-scss"><code>@function rand($min: 0, $max: 100) {
  $str : str-slice(unique-id(), 2);
  $res : toInt($str, 16);
  @return ($res % ($max - $min)) + $min;
}</code></pre>
<p>The first line in the function core is the <code>unique-id()</code> function call. We immediately pass it into the <code>str-slice()</code> function to remove the very first character which is always a <code>u</code>.</p>
<p class="note">Note: According to my tests, the min value used in both implementations of <code>unique-id()</code> is such that the second character of the returned string is always the same (<code>8</code> in base 16, <code>1</code> in base 36). Thus we may need to strip it too, like this <code>str-slice(unique-id(), 3)</code>.</p>
<p>The second line calls a <code>toInt()</code> function, passing it both the string (<code>$str</code>) and the base we want to convert the string from (not to). This is why I say we're ready for both implementations: we only have to change this <code>16</code> to <code>36</code> and everything should work like a charm.</p>
<p>Before going to the last line, let's have a look at the <code>toInt</code> function:</p>
<pre class="language-scss"><code>@function toInt($str, $base: 10) {
  $res   : 0;
  $chars : charsFromBase($base);
  @if $chars !== false {
    $str   : if($base < 64, to-lower-case($str), $str);
    @for $i from 1 through str-length($str) {
      $char    : str-slice($str, $i, $i + 1);
      $charVal : index($char, $chars) - 1;
      $res     : $res + pow(length($base), str-length($str) - $i) * $charVal;
    }
    @return $res;
  }
  @return false;
}</code></pre>
<p><code>$res</code> will store the result we will return once we're done. <code>$chars</code> contains the array of characters used by base <code>$base</code>; we'll see the <code>charsFromBase()</code> function right after. Then, if the base is supported we loop through each characters of the string.</p>
<p>For every character, we isolate it (<code>$char</code>) and convert it to its numeric equivalent (<code>$charVal</code>) thanks to the <code>$chars</code> array. Then, we multiply this number to the base raised to the reversed index in the string. That may sound a little complicated, let me rephrase it: in base 10, <code>426</code> equals <code>4*10^2</code> + <code>2*10^1</code> + <code>6*10^0</code>. That's pretty much what we do here, except instead of <code>10</code> we use the base, and instead of <code>2</code>, <code>1</code> and <code>0</code>, we use the length of string minus the index of the current character.</p>
<p>The <code>pow()</code> function used to raise a value to an exponent is part of <a href="http://compass-style.org/reference/compass/helpers/math/">Compass Math helpers</a>. In case you don't want to use Compass or simply can't use Compass, here is the <code>pow()</code> function in pure Sass:</p>
<pre class="language-scss"><code>@function pow($val, $pow) {
  $res: 1;
  @while($pow > 0) {
    $res: $res * $val;
    $pow: $pow - 1;
  }
  @return $res;
}</code></pre>
<p>And of course, we add this to the result (<code>$res</code>). Once we're done with the string, we return the result to the <code>rand()</code> function. Then, we simply return <code>($res % ($max - $min)) + $min</code> to the user resulting in a random number between min and max values.</p>
<p>Regarding the <code>charsFromBase()</code> function, here is what it looks like:</p>
<pre class="language-scss"><code>@function charsFromBase($base: 10) {
  /* Binary */
  @if $base == 2 {
    @return 0 1;  }
  /* Octal */
  @if $base == 8 {
    @return 0 1 2 3 4 5 6 7;  }
  /* Decimal */
  @if $base == 10 {
    @return 0 1 2 3 4 5 6 7 8 9;  }
  /* Hexadecimal */
  @if $base == 16 {
    @return 0 1 2 3 4 5 6 7 8 9 a b c d e f;  }
  /* Base 36 */
  @if $base == 36 {
    @return 0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y z;  }
  /* Base 64 */
  @if $base == 64 {
    @return A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 + /;  }
  @return false;
}</code></pre>
<p>I only added most common standard bases (binary, octal, decimal, hexadecimal, 36, 64) but I guess we could probably add a couple of others. Actually this is already too much since we know the <code>unique-id()</code> function will return a base16 or base36 encoded string (depending on the implementation they'll keep).</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>That's pretty much it. As I said at the beginning of the article, I couldn't try this code since neither the <code>unique-id()</code> nor the string manipulation functions are currently implemented in the Sass 3.3 Alpha version. So this is pretty much blind coding here!</p>
<p>If you think of anything that could improve this Sass random function, please be sure to tell. Meanwhile you can play with the code directly on <a href="http://codepen.io/HugoGiraudel/pen/ohscb">this pen</a>.</p>
</section>
