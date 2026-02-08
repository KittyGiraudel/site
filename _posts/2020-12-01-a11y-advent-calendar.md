---
title: A11y Advent Calendar
description: An introduction to the A11y Advent calendar and publishing an accessibility tip a day
date: 2020-12-01T10:00:00.000Z
keywords:
  - accessibility
  - a11y
  - tips
---

I am between jobs with a bit of free time, so I thought I would try something new this year and publish **an accessibility tip a day**. Nothing too ground-breaking, and I expect a lot of these tips to be common knowledge for many of you, yet we’ll end the month with a nice list of do’s & don’ts. ✨

I will also announce the daily tip on Twitter with the [#A11yAdvent hashtag](https://twitter.com/search?q=from%3A%40KittyGiraudel%20%23A11yAdvent&src=typed_query). Feel free to share your opinion and tips under that hashtag as well!

The calendar was originally entirely on this page, but I have decided to break it down in more digestible pieces under their own page. <span hidden id="hint">Given the link you just followed, it looks like you’re looking for: <span id="hint-title"></span>.</span>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const hint = document.querySelector('#hint')
  const title = document.querySelector('#hint-title')
  const node = document.querySelector(location.hash)

  if (node) {
    title.innerHTML = `<a href="${node.getAttribute('href')}">${node.innerText}</a>`
    hint.removeAttribute('hidden')
  }
})
</script>

<style>
.toc { margin-top: 2em }
.toc > ul { columns: 16em; column-fill: balance; margin-top: 0 }
.toc a:target { font-weight: bold }
</style>

<div class="toc">
<ul>
<li><a id="day-1-what-is-accessibility" href="/2020/12/01/a11y-advent-what-is-accessibility">Day 1: What is Accessibility?</a></li>
<li><a id="day-2-evaluating-accessibility" href="/2020/12/02/a11y-advent-evaluating-accessibility">Day 2: Evaluating Accessibility</a></li>
<li><a id="day-3-hiding-content" href="/2020/12/03/a11y-advent-hiding-content">Day 3: Hiding Content</a></li>
<li><a id="day-4-self-explanatory-links" href="/2020/12/04/a11y-advent-self-explanatory-links">Day 4: Self-Explanatory Links</a></li>
<li><a id="day-5-document-outline" href="/2020/12/05/a11y-advent-document-outline">Day 5: Document Outline</a></li>
<li><a id="day-6-skip-to-content" href="/2020/12/06/a11y-advent-skip-to-content">Day 6: Skip to Content</a></li>
<li><a id="day-7-page-title-in-spa" href="/2020/12/07/a11y-advent-page-title-in-spa">Day 7: Page Title in SPA</a></li>
<li><a id="day-8-alternative-text-to-images" href="/2020/12/08/a11y-advent-alternative-text-to-images">Day 8: Alternative Text to Images</a></li>
<li><a id="day-9-forms" href="/2020/12/09/a11y-advent-forms">Day 9: Forms</a></li>
<li><a id="day-10-aria" href="/2020/12/10/a11y-advent-aria">Day 10: ARIA</a></li>
<li><a id="day-11-emojis" href="/2020/12/11/a11y-advent-emojis">Day 11: Emojis</a></li>
<li><a id="day-12-readability" href="/2020/12/12/a11y-advent-Readability">Day 12: Readability</a></li>
<li><a id="day-13-zooming" href="/2020/12/13/a11y-advent-zooming">Day 13: Zooming</a></li>
<li><a id="day-14-captions" href="/2020/12/14/a11y-advent-captions">Day 14: Captions</a></li>
<li><a id="day-15-content-warnings" href="/2020/12/15/a11y-advent-content-warnings">Day 15: Content Warnings</a></li>
<li><a id="day-16-animations" href="/2020/12/16/a11y-advent-Animations">Day 16: Animations</a></li>
<li><a id="day-17-anxiety" href="/2020/12/17/a11y-advent-anxiety">Day 17: Anxiety</a></li>
<li><a id="day-18-internationalisation" href="/2020/12/18/a11y-advent-internationalisation">Day 18: Internationalisation</a></li>
<li><a id="day-19-performance" href="/2020/12/19/a11y-advent-performance">Day 19: Performance</a></li>
<li><a id="day-20-content-tone" href="/2020/12/20/a11y-advent-content-tone">Day 20: Content and Tone</a></li>
<li><a id="day-21-testing-accessibility" href="/2020/12/21/a11y-advent-testing-accessibility">Day 21: Testing Accessibility</a></li>
<li><a id="day-22-interactive-widgets" href="/2020/12/22/a11y-advent-interactive-widgets">Day 22: Interactive Widgets</a></li>
<li><a id="day-23-oral-interfaces" href="/2020/12/23/a11y-advent-oral-interfaces">Day 23: Oral interfaces</a></li>
<li><a id="day-24-the-case-for-accessibility" href="/2020/12/24/a11y-advent-the-case-for-accessibility">Day 24: The Case for Accessibility</a></li>
</ul>
</div>
