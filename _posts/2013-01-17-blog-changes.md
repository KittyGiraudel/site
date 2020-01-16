---
title: "Blog changes"
tags:
  - blog
  - writing
---

> **Edit (2013/01/22):** I did a lot of changes after writing this post notably regarding SEO, performances and accessibility. Be sure you read about it!

Hi people! It’s now been two months since I launched the new and active version of hugogiraudel.com and I took the opportunity to make a few changes. Let me introduce them, hoping you find them cool. :)

## Layout

### Content shuffling

As you can see, the layout has been updated! It’s now a 2-columns website. There are a number of reasons which made me change it but I think the most important one was that I was sick of seeing this stuff about me on the home page.

Let’s be realistic: the main content is the blog not the 20 lines about me you could see everytime you loaded the first page. I wanted to enhance the articles so now the main page lists available articles. It seems muuuch better to me this way, what do you think?

However, I wanted to provide visitors a quick glance at who I am, so I thought it could be a good idea to have a little sidebar to display informations about me. Now, I’m thinking of adding a picture of me in the sidebar; I know a lot of people do that on their blog. Any thought about that?

Another thing that occured to me is that the lines were too long. It may be silly but when lines are too extented, it makes the reading more difficult. Now the main column is narrower, reading an article is easier and de facto nicer.

### Responsive concern

I felt like the old layout lacked of responsiveness. It wasn’t bad since it already provided a mobile-friendly version but I wanted a little bit more. This is why I landed on [the 1140px CSS grid](https://www.ramotion.com/agency/web-design/cssgrid/) by Andy Taylor.

I’m particularly happy with this grid system. It is very easy to set up and as you can see it’s pretty darn efficient!

## Design

I didn’t change many things design speaking except the left border on the whole page to wedge everything from the left. I guess both the header and the footer are better delimited thanks to the solid borders; it’s probably better this way. Also, what do you think of the new Codrops tag on the home page? Pretty nice, right?

However I slightly improved the mobile version, especially regarding the nav bar. It was a little bit messy with the previous version; it should now be properly centered. I’m thinking about centering the footer on mobiles as well. Don’t know yet.

## Development

I now rely on a PHP structure for convenience. Actually, I was kind of sick of having to edit a dozen of files every single time I want to make a tiny little change in the header or the footer. So I now have only PHP files, letting me use `include()`.

But, switching all my files to .php means a terrible thing: old URLs won’t work anymore! What about all these tweets, links and poor souls unable to reach my blog posts? No worry. My brother helped me doing some .htaccess in order to allow reaching the blog posts through old URLs. Big thanks to him. :)

While we’re talking about .htaccess: you can now access articles without the file extension like this: https://hugogiraudel/blog. Pretty cool, right?

I also decided to rely on a CDN rather than on self hosting for [Font Awesome](https://fontawesome.com/?from=io) (now in v3.0.1 since a couple of days). I was especially concerned about the file size of my stylesheet because Font Awesome &mdash; as any other icon font &mdash; uses a lot of CSS. Anyway, I’m now using [Tim Pietrusky’s](http://timpietrusky.com) CDN [WeLoveIconFonts](https://weloveiconfonts.com) and I’m pretty happy with it. ;)

## Features

I tried to add a few features in order to make your experience nicer. Nothing big, just a few things which are &mdash; according to me &mdash; UX improvements. Among those:

* Links to articles on the home page are now paginated in order to make the whole page lighter. Only the last 7 articles will be displayed (including Codrops ones) on the first page. To see older blog posts, you’ll have to use the little buttons at the bottom of the screen.
* You can now link to specific sections inside an article thanks to anchor tags on titles. When you hover a level-2 title (like "Features" or "Performances" for example), you’ll see a little # character appearing. Click on it to have a section-specific URL.

## Performances

> I always try to load the page as fast as I can.

I’m kind of psychotic when it comes to performance. I always try to make the page as fast as I can. I’m really pissed off when I’m waiting for a page to load more than 2 seconds, so I tried to do my best to make the loading time as quick as possible.

Among the many things I did on the topic, I:

* Did a lot of work on the CSS to clean it, make it faster, with less selectors, faster selectors, ans so on.
* Reduced the number of HTTP requests.
* Am still working on the JavaScript part to make it asynchronous.
* Asked [Tim Pietrusky](https://twitter.com/timpietrusky) to improve caching and compressing at [WeLoveIconFonts.com](https://weloveiconfonts.com). Thanks dude!

## Accessibility

I don’t know if it’s a sudden realisation or the recent [A11y project](https://a11yproject.com/) which motivated me to do that but I took some time to improve accessibility on the site. Plus, it gave me the opportunity to learn some things on the topic.

First of all, I switched a bunch of my divs to "new" HTML5 elements. So I’m now using `<header>`, `<article>`, `<aside>`, `<footer>`, `<section>`, and so on. I must say it feels right, really.

Secondly, I dug a little into ARIA roles. I have to say I didn’t know it was such a deep and complex topic, so I may have understand a few things wrong. Anyway, I added a `role=""` attribute to many elements in the site, especially on the home page.

I also gave a few tries to keyboard navigations and I have to say it’s really not that bad. If you have a few minutes left, try it on the home page and tell me what you think about it.

By the way, if some accessibility ninja is passing by and finds something wrong, please be sure to tell me. :)

## SEO

### Microdatas

SEO, big thing! I decided to push it one step further by trying microdatas. Man, this is not an easy thing. If you’re not familiar with microdatas, the main idea is to label content to describe a specific type of information (person, event, review, etc.). This aims at helping search engine bots understanding the content they index.

Now if you inspect the sidebar code, you might see some microdatas about me including name, job title, nationality, urls, and so on. I believe it will help search engines indexing datas about me. We’ll see if it works.

### Hidden content

I also edited the [jQuery plugin](https://github.com/wesnolte/Pajinate) I use for pagination on the home page because it was using `.hide()` to hide content from other pages but the current one. And you’re not without knowing search engines don’t index stuff set to `display: none;`.

So I gathered my courage, opened the file and changed those hide and show methods by a class toggling. This class hides things with CSS, letting search engine index the content. It may sound silly but for a JS douche like me, editing a plugin is a pretty big deal. :D

## To do

You tell me. If you have any request, comment, advise or any feedback to do, be sure to speak. Thanks a lot.
