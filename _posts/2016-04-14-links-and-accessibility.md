---
title: Links and accessibility
description: A guide on links and accessibility and what to know to do things well
tags:
  - Accessibility
  - HTML
edits:
  - date: 2026/03/19
    md: A decade later, I’ve realised the proposed solution is suboptimal because it doesn’t account for voice recognition software, so I added [a section about that](#accounting-for-voice-recognition).
---

The other day, [a friend](https://twitter.com/smartmike) and I were having a conversation about a tricky accessibility puzzle so I thought I’d write a few lines about it.

Consider a search results page with a way to order results per criteria (date, price, availability, etc.). Each criteria has its own link, which refresh the page with some different query strings. So far, so good.

Here is how we would instinctively write it:

```html
<p class="sort-by">
  Sort by: <a href="…">date</a> | <a href="…">availability</a>.
</p>
```

## The problem

The markup presented above has an accessibility problem: links are non-explicit for assistive technologies.

Some AT softwares collect the links of the page to provide easy navigation. For this reason, we always recommend to have explicit link labels. In our current scenario, here is what the AT would map:

- date
- availability

That’s poor. The user is likely to have a hard time figuring out what these links are meant to do. It certainly isn’t obvious that they are used to sort the results of the search.

I would also argue that the pipes (`|`) should not live in the markup as they are strictly presentational, but that’s a lesser problem. Also one easily fixed with:

```css
.sort-by a ~ a::before {
  content: ' | ';
}
```

{% callout %}
Edit 2026: It is worth pointing out that a lot of screen-readers actually read pseudo-elements’ content so moving pipes in the CSS, albeit correct, does not actually make them unannounced.
{% endcallout %}

## The solution

My first bet was to add some visually hidden content inside the links to make them more explicit to a screen reader, while not being visible on screen. Like so:

```html
<p class="sort-by">
  Sort by:
  <a href="…"> <span class="visually-hidden">Sort by </span>date </a>
  <a href="…"> <span class="visually-hidden">Sort by </span>availability </a>
  .
</p>
```

The [`.visually-hidden` class](/snippets/sr-only-class/) (or sometimes `.sr-only`) hides content on screen while keeping it available to screen readers. That solves our non-explicit links problem. Perfect.

The next problem is that a screen reader going sequentially through the document would read something like:

- Sort by
- Sort by date
- Sort by availability

As you can see, the initial “Sort by”, the one visually displayed, is being read out loud which then causes duplicated content for AT users. Duh.

Thankfully, there is an easy solution: `aria-hidden="true"`.

```html
<p class="sort-by">
  <span aria-hidden="true">Sort by:</span>
  <a href="…">
    <span class="visually-hidden">Sort by </span>
    date
  </a>
  <a href="…">
    <span class="visually-hidden">Sort by </span>
    availability
  </a>
  .
</p>
```

Boom. Solved.

### Accounting for voice recognition

The year is 2026. Completely by chance, I’ve stumbled upon this article from 10 years ago, and I realised that the proposed solution is not ideal. Let’s look into why.

Voice recognition software, such as Dragon Naturally Speaking, can be used to navigate the web. To interact with controls on the page, one can dictate the text label of the desired control. For instance, “Add to cart” or “Sort by date”. 

Inserting visually hidden content in the middle the text label can be a problem, because it creates a discrepancy between what is spoken and what exists in the DOM. The assistive technology may fail to find a control matching the label spoken by the user.

I was trying to find an authoritative source for that, and found this good quote by Sara Soueidan (in a just as good article):

> Inserting visually hidden text in the middle of a visible string of text on a button like that prevents users browsing and navigating using voice commands from interacting with the button.  
> — Sara Soueidan in *[Accessible Text Labels For All](https://www.sarasoueidan.com/blog/accessible-text-labels/#talking-your-way-through-web-browsing-with-voice-commands)*

So where does that leave us? I’m honestly not super sure. Off the top of my head, I’d maybe do something like this:

```html
<p class="sort-by">
  <span>Sort by:</span>
  <a href="…">
    date
    <span class="visually-hidden">(filter)</span>
  </a>
  <a href="…">
    availability
    <span class="visually-hidden">(filter)</span>
  </a>
  .
</p>
```

Or maybe even more explicitly (but that differs from the original design):

```html
<p class="sort-by">
  <a href="…">Sort by date</a>
  <a href="…">Sort by availability</a>
</p>
```

## Final thoughts

I just thought it was an interesting scenario, and while it might look like over-optimisation, I do believe this is what makes the difference for people with disabilities.

Happy coding!

PS: Thanks to accessibility expert [Heydon Pickering](https://twitter.com/heydonworks) for reviewing this solution.
