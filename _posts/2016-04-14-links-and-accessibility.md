---
title: Links and accessibility
keywords:
  - accessibility
  - a11y
  - links
  - html
---

The other day, [a friend](https://twitter.com/smartmike) and I were having a conversation about a tricky accessibility puzzle so I thought I’d write a few lines about it.

Consider a search results page with a way to order results per criterias (date, price, availability, etc.). Each criteria has its own link, which refresh the page with some different query strings. So far, so good.

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

[The `.visually-hidden` class can be safely borrowed from HTML5BoilerPlate](https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css#L124-L133). It hides content on screen while keeping it available to screen readers. That solves our non-explicit links problem. Perfect.

The next problem is that a screen reader going sequentially through the document would read something like:

- Sort by
- Sort by date
- Sort by availability

As you can see, the initial “Sort by”, the one visually displayed, is being read out loud which then causes duplicated content for AT users. Duh.

Thankfully, there is an easy solution: `aria-hidden="true"`.

```html
<p class="sort-by">
  <span aria-hidden="true">Sort by:</span>
  <a href="/#/date">
    <span class="visually-hidden">Sort by </span>
    date
  </a>
  <a href="/#/availability">
    <span class="visually-hidden">Sort by </span>
    availability
  </a>
  .
</p>
```

Boom. Solved.

## Final thoughts

I just thought it was an interesting scenario, and while it might look like over-optimisation, I do believe this is what makes the difference for people with disabilities.

Happy coding!

PS: Thanks to accessibility expert [Heydon Pickering](https://twitter.com/heydonworks) for reviewing this solution.
