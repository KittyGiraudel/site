---
title: Writing in Sublime Text
tags:
  - sublime text
  - writing
  - editing
---

I use to write a lot.<sup>[citation needed]</sup> I have spent countless hours writing articles, books, mails and what else. And for all that, I use a single tool: Sublime Text. As far as I am concerned, Sublime Text is the perfect environment for writing, especially tech writing. In this article, I’d like to show you my setup so you can use Sublime Text for writing as well.

<figure class="figure" style="clear: both">
  <img src="/assets/images/writing-in-sublime-text/preview.png" alt="" />
  <figcaption>My writing environment in Sublime Text</figcaption>
</figure>

## Pimp my editor!

Let’s get started with the basics: a beautiful theme for Sublime Text. If you ask me, there is nothing better than [Spacegray](https://github.com/kkga/spacegray). Spacegray not only provides a new syntax highlighting theme for the coding area, but also redefines the whole UI to change color, styles and more generally the whole look and feel.

Spacegray provides three different themes:

- Spacegray Grey Dark
- Spacegray Grey Light
- Spacegray Eighties

I’ve been running on the dark grey default theme for a while but I recently moved on to Eighties which has a browish style that is very appealing.

## Customize the thing

If there is one thing I do like with Sublime Text, it is the amount of options. If you haven’t already, open the default settings file (_Sublime Text > Preferences > Settings - Default_) and browse through all the available options. You’ll probably discover a thing or two.

Most options default value make sense although there are some of theme that you might want to change. Here is my own configuration file (omitting a few boring things), annotated with comments to explain each choice:

```javascript
{
  // Bold folder labels in the sidebar
  // so they are distinguishable from regular files
  "bold_folder_labels": true,

  // Make the caret blink with a smooth transition
  // rather than a harsh one
  "caret_style": "phase",

  // Draw a border around the visible part of the minimap
  "draw_minimap_border": true,

  // Draw all white spaces as very subtle dots
  // as white spaces are very important in some cases
  "draw_white_space": "all",

  // EOF is kind of a convention and this option makes sure
  // there is always one as soon as you save a file
  "ensure_newline_at_eof_on_save": true,

  // I have a terrible sight and this makes things big
  "font_size": 20,

  // Add extra gap on top and bottom of each line
  // which is basically increasing line height
  "line_padding_bottom": 8,
  "line_padding_top": 8,

  // Show encoding and line endings
  // in the status bar on the bottom right
  "show_encoding": true,
  "show_line_endings": true,

  // Force tab size to be equivalent to 2 spaces
  "tab_size": 2,

  // Make sure there are no tabs, only spaces
  "translate_tabs_to_spaces": true
}
```

## Extra plugins

### Markdown all the things!

The first thing to know is that I, as most tech writers, use Markdown for basically any write up. Markdown is a terrific format for both writing (obviously) and reading, no matter whether it’s been compiled to HTML or not. Because Markdown uses text symbols to represent content hierarchy (`#` for title, `*` and `_` for emphasis, `>` for blockquotes…), it makes it very convenient to read an unprocessed Markdown file.

Sublime Text comes with a default Markdown syntax highlighter, although you might need some extra features if you happen to write a lot in the editor. For this, there is [Markdown Extended](https://github.com/jonschlinkert/sublime-markdown-extended). This plugin adds extra feature to the default Markdown highlighter, such as highlighting for any YAML Front Matter and sub-highlighting of fenced code blocks. _This_, is absolutely amazing. Basically, that allows you to have Markdown syntax highlighting in the current file **and** highlighting code blocks with their relevant highlighter (CSS, JS or whatever).

<figure class="figure">
  <img src="/assets/images/writing-in-sublime-text/sub-highlighting.png" alt="" />
  <figcaption>Lines 31 to 37 are being highlighted as SCSS</figcaption>
</figure>

Last but not least tool for Markdown: [Markdown Preview](https://github.com/revolunet/sublimetext-markdown-preview). This plugin is actually quite huge, but there is one thing I use it for: previewing the current file in the browser using the GitHub API (or Python-Markdown when running offline). I don’t use it that often, but sometimes it is better to actual render the file in a browser to see what it looks like (especially when it involves images).

<figure class="figure">
  <img src="/assets/images/writing-in-sublime-text/preview-in-browser.png" alt="" />
  <figcaption>This article previewed in Chrome locally thanks to Markdown Preview</figcaption>
</figure>

### 1 word, 2 words, 3 words…

Let’s be honest: everything is about word count when writing. How long is this article? How many pages are there in this chapter? Knowing the number of words in a document is extremely handy.

I suppose there are countless (see what I did there?) word counter plugins for Sublime Text out there; I chose [WordCount](https://github.com/titoBouzout/WordCount). This simple plugin adds the number of words at the very left of the status bar, below the coding area.

On top of word counting, I also use WordCount to count the number of estimated pages (number of words per page is configurable, since I tend to write books inside Sublime Text. It turns out to be quite handy knowing the approximate number of pages for a given chapter in the blink of an eye.

Neat addition: when selecting a portion of content, WordCount gives the number of words in this section only instead of the whole document.

### Sidebar Enhancements

Last major Sublime Text plugin for me: [Sidebar Enhancements](https://github.com/titoBouzout/SideBarEnhancements). For the record, this plugin has been made by the same guy behind WordCount, so you can say this is good stuff.

Sidebar Enhancements, as the name states, improves the sidebar projet manager by adding extra options on right click, such as a clipboard to actually copy and paste files, a move command, and much more.

<figure class="figure">
  <img src="/assets/images/writing-in-sublime-text/sidebar-enhancements.png" alt="" />
  <figcaption>Right click on file provides a lot of new options thanks to Sidebar Enhancements</figcaption>
</figure>

Last time I had a fresh install of Sublime Text, I realized how poor the default sidebar is compared to the one provided by this excellent plugin. Highly recommended.

## Spell checking

Paweł Grzybek, in the comments, asked for a spell checking feature. I don’t use it myself, but I know that Sublime Text does support spell checking through 2 options:

```javascript
"spell_check": true,
"dictionary": "Packages/Language - English/en_US.dic"
```

The first one enables spell checking, and the second one is the dictionary used to perform the corrections. I am not entirely sure where to download a language dictionary file, but I suppose this is actually quite easy to find. If English is the only language you need spell checking for, then you can have direct out-of-the-box support for it.

## Final thoughts

That’s it folks, you know all my secret to writing in Sublime Text! I have been using this set up for years now and I don’t think this is going to change anytime soon. So far, so good.

Although, if you have any advice… I’m all ears! :)
