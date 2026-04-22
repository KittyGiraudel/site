---
title: Useful Compass extensions that are worth a try
description: A gallery of handy Compass extensions that are worth a try
tags:
  - Sass
  - Compass
---

[Compass](http://compass-style.org/) is a great Sass framework. Not only because it provides a hundred useful mixins and functions and a sprite builder, but also because it allows authors to build their own extensions, thus use other authors’ ones.

A Compass extension is some kind of bundle packed as a gem, that can be installed, imported then used in your Sass stylesheets. Installing a Compass extension is a 3-step process:

- In your terminal, run `gem install {extension_name}`
- In your `config.rb` file (Compass), add `require "{extension_name}"`
- In your stylesheet(s), add `@include "{extension_name}"`

The first step installs the gem on your machine. The second tells Compass to use the gem. The third imports the extension content so it can be used in your Sass files.

Quite easy, isn’t it? Now that you know how to use them, what if I showed you a couple of Compass extensions that are definitely worth a try? Remember, all you have to do to try them is to run the 3 commands listed above. Also, most of these are included in the SassMeister playground so you can try them online as well.

## Modernizr Mixin

[Modernizr Mixin](https://github.com/danielguillan/modernizr-mixin) is a wrapper for Modernizr class API built by [Daniel Guillan](https://www.sitepoint.com/compass-extensions-worth-a-try/#:~:text=API%20built%20by-,Daniel%20Guillan,-.%20This%20extension%20provides). This extension provides a clean API to ease and normalize the use of Modernizr’s classes in your stylesheets.

Let’s say you build something that relies on both CSS transforms and opacity. You might write something like this in your stylesheet:

```scss
.csstransforms.opacity {
  .element {
    /* Do something if both CSS transfroms and opacity are supported */
  }
}
```

Or if you build it the other way around, providing a fallback if any of the two is not supported:

```scss
.no-csstransforms, .no-opacity {
  .element {
    /* Do something if either CSS transforms or opacity is not supported */
  }
}
```

While it reads well, there is already an inconsistency between the 2 approaches. One uses `.a.b .c`, and the other `.a .c, .b .c`. Thus it might not be obvious at first glance what is happening here.

Modernizr Mixin makes things better:

```scss
.element {
  @include yep(csstransforms, opacity) {
    // Do something if both CSS transforms and opacity are supported
  }
}
```

Or again, using the reverse logic:

```scss
.element {
  @include nope(csstransforms, opacity) {
    // Do something if CSS transforms and opacity are not supported
  }
}
```

It looks pretty nice in my opinion, so if your app relies on Modernizr, you might want to give this mixin a try. It’s really just syntactic sugar but gosh, sugar is good!

I had the cool opportunity of having Daniel Guillan write about how he made his mixin on my own blog, so if you want to read about the making of it, be sure to have a look at [Daniel’s article](/2014/05/12/modernizr-sass-mixin/).

## Quotation Marks

[Quotation Marks](https://github.com/hagenburger/quotation-marks) is a Compass extension from [Nico Hagenburger](https://twitter.com/Hagenburger) that helps you dealing with quotation marks in multilingual environments.

We often forget that each language has its own way of handling quotation marks. When dealing with several languages in the same application, it is important to respect those typographic rules. Thankfully CSS provides pseudo-elements and the `content` property for such a purpose.

Basically, Quotation Marks is a dictionary of quotes. It has a [big Sass map](https://github.com/hagenburger/quotation-marks/blob/master/stylesheets/_quotation-marks.scss#L1) of quotes associated to languages, which then can be used through a simple mixin: `localized-quotation-marks($languages)`.

Let’s say your site supports four languages: English, French, Italian, and German and uses blockquotes to display customers’ opinions. Because you support multiple languages and have users from multiple countries, you’d like the quotation marks from the quotes to adapt to the language. Now let’s Sass it up a little bit.

```scss
// Importing the Compass extension
@import "quotation-marks";

// Listing all supported languages
$supported-languages: en, fr, it, de;

// Outputing accurate quote marks on `blockquote` element
blockquote {
  @include localized-quotation-marks($supported-languages);
}
```

And this compiles to:

```css
@charset "UTF-8";

blockquote:lang(en):before, 
blockquote:lang(de):after {
  content: "“";
}

blockquote:lang(en):after {
  content: "”";
}

blockquote:lang(fr):before, 
blockquote:lang(it):before {
  content: "«";
}

blockquote:lang(fr):after, 
blockquote:lang(it):after {
  content: "»";
}

blockquote:lang(de):before {
  content: "„";
}
```

As you can see, not only does it do the job, but it also does it well! Indeed, Quotation Marks uses Sass placeholders to group similar quotation marks in order to reduce the final CSS size.

Note that `blockquote:lang(de)` will match in any of these scenarios:

- `<html lang="de"> <blockquote>`
- `<blockquote lang="de">`
- `<html lang="de"> <blockquote lang="de">`

So this is great! No matter how you decide to tackle the issue on the HTML front, the CSS will remain the same, all powered by Quotation Marks. No excuse for leaving those ugly default quotes now!

## SassyIcons

[SassyIcons](https://github.com/pascalduez/SassyIcons) is a Sass tool that aims at helping to deal with icon sprites, SVG, PNG fallbacks, cross-browser support and all that sort of difficult stuff. Basically, it’s a wrapper for the [Compass sprite API](http://compass-style.org/help/tutorials/spriting/), using Modernizr classes.

It was designed by [Pascal Duez](https://twitter.com/pascalduez) and, unlike many extensions, was tested on live projects, so you can be sure it’s rock solid by now.

SassyIcons has a couple of goals:

Gives you the ability to have several “thematic” sprites, managed into sub-folders (e.g. `social`, `ui`, `illustrations`, etc.)
Allows you to choose and configure which file format should be used (SVG or PNG)
Helps you with cross-browser support (back to Internet Explorer 7) and high DPI displays
Provides positioning flexibility to cover a wide range of tricky situations

Now, let’s get to the code.

First, you create a sprite sheet, giving it a name (and a spacing, if you will).

```scss
@include sprite-map-create(social, $spacing: 10px);
```

This is where the Compass sprite API is being used. No CSS is output there, but two files are generated: One for regular usage, and one for high-density displays. Then a collection of placeholders are being generated for internal use.

Now, whenever you want to use an icon:

```scss
.twitter {
  @include icon(social, twitter);
}
```

The first parameter is the sprite sheet name, the second is the icon name. The generated CSS depends on the options, but in most cases you’ll want to use inlined SVG with PNG fallbacks, leading to:

```css
.twitter {
  background-image: url('data:image/svg+xml;base64,...');
  background-repeat: no-repeat;
}

.no-svg .twitter, 
.no-js .twitter/*, 
 other icons as well */ {
  background-image: url('../img/icons/social/png-s62add47933.png');
  background-repeat: no-repeat;
}

.no-svg .twitter, 
.no-js .twitter {
  background-position: 0 -186px;
}
```

Better not to write this by hand, huh?

If you don’t want SVG but only PNG, you would do this:

```scss
.twitter {
  @include icon(social, twitter, $format: "png");
}
```

Then:

```css
.twitter/*,
 other icons as well */ {
  background-image: url('../img/icons/social/png-s62add47933.png');
  background-repeat: no-repeat;
}

@media (-webkit-min-device-pixel-ratio: 1.3), (min-resolution: 125dpi), (min-resolution: 1.3dppx) {
  .twitter/*,
   other icons as well */ {
    background-image: url('../img/icons/social/png_2x-s177eed3133.png');
    background-size: 32px auto;
  }
}

.twitter {
  background-position: 0 -186px;
}

@media (-webkit-min-device-pixel-ratio: 1.3), (min-resolution: 125dpi), (min-resolution: 1.3dppx) {
  .twitter {
    background-position: 0 -141px;
  }
}
```

Since PNG is not a vector format, here it covers high-density displays with specific media queries and the @2x sprite.

As you can see, SassyIcons is quite a powerful tool to plug into the Compass sprite extension. If you already use Compass sprites, I can’t recommand SassyIcons enough.

On a side note, [grunt-svg2png](https://github.com/pascalduez/grunt-svg2png) was also made by Pascal, so both tools are fully compatible. Great combo to deal with SVG only, automating all the PNG stuff.

## SassyExport

[SassyExport](https://github.com/ezekg/sassy-export) first came as an extension for [SassyJSON](https://github.com/KittyGiraudel/SassyJSON), a JSON parser written in Sass. I suggested [Ezekiel Gabrielse](https://github.com/ezekg) (SassyExport’s author) to get rid of the SassyJSON dependence by moving JSON encoding/decoding to Ruby. So he did.

SassyExport is a Compass extension that does a single thing: Exports a Sass map to JSON. Thus, it provides a very simple API in the shape of a single mixin, `SassyExport()`.

```scss
@import "SassyExport";

$map: (
  hello: world,
);

@include SassyExport("/json/hello.json", $map, $pretty: true);
```

The first argument is the path leading to the JSON file to create/update. What is cool here is it’s relative to the `config.rb` Compass file which has to be at root level of your project. So no matter where you call this mixin, it will always lead to the same file.

The second argument is the map that needs to be converted to JSON and exported. And the 3rd argument is whether it should be pretty-printed. If `false`, then the JSON gets inlined.

SassyExport can come in handy when you want to synchronize your breakpoints between Sass and JavaScript, yet still have them defined in your stylesheets.

```scss
// _config.scss
$breakpoints: (
  "small": 767px,
  "medium": 992px,
  "large": 1200px
);

// _export.scss
@import "SassyExport";

@include SassyExport("/json/breakpoints.json", $breakpoints);
```

Then, you end up with a .json file like this:

```json
{
  "small": "767px",
  "medium": "992px",
  "large": "1200px"
}
```

From there, you can request this file with an Ajax request or whatever. Then, you could execute some JavaScript only when the `small` breakpoint is reached.

If later you change this `767px` to, let’s say, `750px`, then your JavaScript won’t be out of sync, thanks to SassyExport.

## Sass Color Helpers

Unfortunately, [Sass Color Helpers](https://github.com/voxpelli/sass-color-helpers) (SCH) from [Voxpelli](https://twitter.com/voxpelli) is not a Compass extension (yet) but I thought it was worth mentioning. SCH, as its name tells us, provides a couple of Sass functions to help manipulate colors.

Among other things, it provides a function to calculate what would be the accurate alpha channel for a color to achieve a certain target color when overlaying a specified bottom color.

This can be useful when extracting colors from a flat image where you can estimate two colors that are rendered on top of another, but need help with figuring out the alpha number of the top color to achieve the target color in the image.

For instance imagine a slightly transparent black box on top of an image. When passing the color from the image (color picked?), the target color (from the mock-up), and the color of the box (black in our case) to the `ch-calculate-alpha` function, it should return the approximate alpha channel to be applied to the overlay to achieve the desired result.

Let’s illustrate our example with some code:

```scss
$overlay-color: black;
$target-color: #16110e; // Color picked from the mock-up
$bottom-color: #5e534f; // Color picked from the mock-up
$alpha: ch-calculate-alpha($overlay-color, $bottom-color, $target-color); // 0.79464
```

Thus, in order to achieve the desired result, you need to apply the following color to the semi-transparent black overlay:

```scss
.overlay {
  $overlay-color: black;
  $target-color: #16110e;
  $bottom-color: #5e534f;
  $alpha: ch-calculate-alpha($overlay-color, $bottom-color, $target-color);

  // Accurate declaration
  background: $overlay-color; // Fallback IE 8
  background: rgba($overlay-color, $alpha);
}
```

And we get the following result:

```css
.overlay {
  background: black;
  background: rgba(0, 0, 0, .79464);
}
```

Also, SCH exposes a `ch-color-contrast` function that returns the contrast ratio between two colors (based on [this great tool from Lea Verou](https://leaverou.github.io/contrast-ratio/)), as well as a `ch-best-color-contrast`, which returns the color from the list of given colors with the best contrast with the first argument passed to the function.

```scss
$color-contrast: ch-color-contrast(red, purple); // 2.4
$best-color: ch-best-color-contrast(red, purple blue green yellow); // yellow
```

This can be useful when you have dynamic backgrounds, and want to compute the best text color to match the given background.

Last but not least, SCH provides some HSV and HSB to HSL converting functions, perfect when dealing with the HSV system from Photoshop.

## Final Thoughts

There are many more outstanding Compass extensions and Sass tools available, including popular grid systems like [Singularity](https://singularity.gs/) and [Susy](https://www.oddbird.net/susy/). But I think it’s nice that we had a look at some rather unknown extensions as well.

And finding Sass extensions has become easier than ever with Sache.in. Do you have any in there? :)

