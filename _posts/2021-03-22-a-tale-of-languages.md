---
title: A tale of languages
---

Today, we released the [French version of the Gorillas website](https://gorillas.io/fr). It’s only once we went live that I noticed an interesting piece of trivia I want to share in this article.

For good or for bad, we decided not to translate the word “rider” (as in, a delivery person delivering goods on a bike) in French. There are a few ways to translate it, such as “<span lang="fr">livreur·se</span>” or “<span lang="fr">coursier·ère</span>”, but we decided to land on the Anglicism “rider”, which (hopefully) is understandable enough.

Now, our top call-to-action on the home page states “Become a rider” in English. Once translated, it says “<span lang="fr">Devenir rider</span>”. The problem is that “rider” means something in French, and it becomes “wrinkles.” That means the CTA essentially is pronounced as “Become wrinkled” by French screen-readers. Uh-oh.

## The solution

We use POEditor to manage our translations. It’s a service making it possible for us to map translation keys to localised content. For security reasons, we do not allow translations to contain HTML. That means we needed to implement a fix in the frontend.

We had to be a little creative with the implementation. It’s not the cleanest, but it does the job relatively well. The main idea is that when translating a key into French, we check if the translation contains the word “rider” (or “riders”), and replace it with a `span` with the `lang` attribute set to `en`.

```html
<html lang="fr">
  <body>
    <a href="#">Devenir <span lang="en">rider</span></a>
  </body>
</html>
```

Here is the implementation in approximate code, remove all React considerations for sake of simplicity:

```js
// Assuming these global constants
const language = 'fr'
const translations = { 'home.riders.cta': 'Devenir rider' }
const regExp = /\b(riders?)\b/

const translate = term => {
  const content = translations[term]

  if (language === 'fr' && regExp.test(content)) {
    return content.replace(regExp, '<span lang="en">$1</span>')
  }

  return content
}

translate('home.riders.cta')
// Devenir <span lang="en">rider</span>
```

This builds the pronunciation fix within our translating function so we don’t really have to think about it and it keeps working as we keep adding content. That’s pretty solid and does the job quite well!

## Caveats

Not so fast. I am not the most efficient person with VoiceOver, but I’m starting to slowly get the hang of it. Unfortunately, I could not really confirm that my fix worked. I tried changing my browser language, and playing with various settings, but no dice. The pronunciation remained fully French despite the `span` marked English.

{% info %} Fun fact: [Yakim](https://twitter.com/yakimvanzuijlen) explained that there are 3 levels of languages. There is the system language, the language specified on the html document as well as the language setting in the VoiceOver rotor. That last one basically overwrites both the language setting on the system and the webpage. {% endinfo %}

[Gijs Veyfeyken](https://twitter.com/veyfeyken) confirmed what I experienced: it turns out that VoiceOver cannot always switch language inside a link. Indeed, it works in reader mode (although that appears to depend on browsers) or when using a non-interactive element such a `<p>`, but not when listing links for easy navigation.

[Barry Pollard](https://twitter.com/tunetheweb) was kind enough to create [some test cases](https://www.tunetheweb.com/experiments/lang/) for us to play with. The long story short is that:

- Using a `<span>` or `<i>` with a `lang` attribute inside a `<a>` does not work properly. The `lang` attribute is basically ignored.
- Using a `<div>` with a `lang` attribute inside a `<a>` **does work**, provided the `<div>`’s display is not set to `inline`, or `inline-block`. Unfortunately, that breaks styling.

We ran these tests with VoiceOver on Brave, Firefox, iOS Safari and Safari. It turns out only desktop Safari handles all this properly. Using a `<span>` with a `lang` attribute inside a `<a>` does not work consistently elsewhere and often the `lang` has essentially no effect.

Laura Ciporen shares a similar experience with JAWS where language markup works fine in a heading but not when listing headings for easy navigation, in which case the language markup is gone.

## Conclusion

Marking specific bits of content with a different language via the `lang` attribute is a legit case, and how it should be done by the book. Unfortunately, in some situations such as in links, the `lang` attribute will be essentially omitted.

If you have more information about this topic, feel free to share on Twitter!
