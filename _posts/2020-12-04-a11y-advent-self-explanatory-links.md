---
title: 'A11yAdvent Day 4: Self-Explanatory Links'
---

Let’s stay in the topic of screen-readers and talk about links. I believe a relatively little known feature of many screen-readers is the ability to list all links in a page in order to navigate more rapidly. Besides that feature, tabbing through page means jumping from link to link, skipping the text between them. Either way, links end up being announced devoid of their surrounding content and grammatical context.

That means it is important for links to be self-explanatory. In other words, a link should make sense on its own without the rest of the sentence it lives in or its visual surroundings. The content of the link should describe what the link does.

To have a look at what links look like in a given page, I would highly commend this [accessibility bookmarklet](https://xi.github.io/a11y-outline/) by Tobias Bengfort. Drag it onto your bookmark bar, then activate it on any page to be prompted with a little dialog which contains a dropdown menu offering 3 options: landmarks, headings and links. The last one is the relevant one in this case.

If you spot a link that does not make much sense on its own, revise its content until it does. No more “click here”, “learn more” or other non-sensical links! Similarly, avoid mentioning “link” in the text since most screen-readers already do that.

As an example, consider a link visually stating “Edit” in a list of items. It makes sense, because the link belongs to a list item, therefore it is implied that it is for that specific item. But when listing links or just tabbing through, all links end up saying “Edit”, which is not good at all. To fix that problem, we can apply what we learnt yesterday and add some visually hidden content to the link.

```html
<a href="/edit/1234567890">
  Edit <span class="sr-only">item [distinguishable item name]</span>
</a>
```
