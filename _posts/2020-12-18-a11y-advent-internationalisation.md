---
title: 'A11yAdvent Day 18: Internationalisation'
---

If accessibility is the discipline aiming at providing equal access to everyone, then the internationalisation of content has to play an important part in it. Content provided in a language that is not understood by the user is pretty inaccessible.

Localisation and internationalisation (sometimes shortened l10n and i18n respectively) are broad topics requiring a lot of knowledge to do well. Large companies tend to have teams dedicated to internationalisation and the proper localisation of content. It takes time and effort.

Nevertheless, we can outline a certain amount of advice and things to consider to make sure the content is properly localised:

- The `html` element should have a `lang` attribute (as in ISO2 code, e.g. `lang="en"`). Besides being indexed by search engines, it is used by screen-readers to use the appropriate language profile using the correct accent and pronunciation. Elements containing text in another language should be equally marked as such, for the same reason. If a page in English contains a sentence in Arabic, the DOM element containing that text should be marked as `lang="ar"`.

- Links pointing to a resource in another language than the one the page is displayed in should be marked with the `hreflang` attribute. For instance, if this page were to link to a page in Russian, the link would need to be marked with `hreflang="ru"`.

- Flags should be used to represent countries, not languages. When listing languages, refrain from illustrating them with flags if possible. If flags are important for visual identity, consider reversing the logic so countries are listed (with their flag), followed by a language (for instance “<span role="img" aria-label="Canada">🇨🇦</span> Canada (English)” and “<span role="img" aria-label="Canada">🇨🇦</span> Canada (Français Canadien)”).

- Flags should exclusively be used to represent countries, not languages. For instance, while French is mainly spoke in France, it is also spoken in Congo and Canada—among other territorial entities. Or Spanish, which is spoken all over South America, but too often represented with a Spain flag. Flags are for countries, not languages.

- Dates and currencies should ideally be authored in the format conveyed by the language of the page. For instance, a document authored in American English should use the American date format `MM-DD-YYYY`, when a page in German should use the German one `DD.MM.YYYY`. Content in French should author currencies the French way such as “42 €” with a space between the amount and the symbol, which lives after the amount. The [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) native API and libraries like [Luxon](https://moment.github.io/luxon/) and [accounting.js](https://www.npmjs.com/package/accounting) can help with this process.

- Be mindful of bias when designing interfaces and the systems supporting them. For instance, having one first name and one last name is quite an occidental structure. All around the world, people have many names, middle names, initials, no first name, no last name, names with a single character… If you have never read [Falsehoods Programmers Believe About Names](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/), I cannot recommend it enough.

Internationalisation is hard to do well. Mistakes will be made, and it’s never going to be perfect. It’s a matter of iterating on it and doing better. In a world as connected as ours, we as organisations providing content and products, need to put aside our bias and design systems which fit everyone, whoever they are, and wherever they come from.
