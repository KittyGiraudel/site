---
title: Closing on outside click
---

As part of the [navigation on the Gorillas website](/2021/03/13/gorillas-nav-a-case-study/), we needed a way to close the menu when clicking outside of it or tabbing out of it. I briefly touched on how we do it in the aforementioned article, but we’ve since revisited it and I wanted to write a short note about it.

There are plenty of ways to achieve this. That’s also why we implemented it 3 times, every time with a slightly different twist. We eventually landed on something that’s relatively simple so I thought I’d share it (both [vanilla JS](#vanilla-JS) and [React](#react)).

## HTML structure

Consider the following [disclosure widget pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure):

```html
<nav role="navigation">
  <button
    type="button"
    id="nav-toggle"
    aria-expanded="false"
    aria-controls="nav-content"
  >
    Navigation
  </button>
  <div id="nav-content" aria-hidden="true" aria-labelledby="nav-toggle">
    <ul>
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
      <li><a href="#">Link 3</a></li>
    </ul>
  </div>
</nav>

Some <a href="#">other link</a> or whatever.
```

{% info %} For more information about why we went with this particulary HTML structure, please refer to the [comprehensive post about Gorillas’ navigation](/2021/03/13/gorillas-nav-a-case-study/). {% endinfo %}

## Vanilla JS

Now, with vanilla JavaScript, our implementation would look something like this:

```js
const toggle = document.getElementById('nav-toggle')
const content = document.getElementById('nav-content')

const show = () => {
  toggle.setAttribute('aria-expanded', true)
  content.setAttribute('aria-hidden', false)
}

const hide = () => {
  toggle.setAttribute('aria-expanded', false)
  content.setAttribute('aria-hidden', true)
}

toggle.addEventListener('click', event => {
  event.stopPropagation()
  JSON.parse(toggle.getAttribute('aria-expanded')) ? hide() : show()
})

const handleClosure = event => !content.contains(event.target) && hide()

window.addEventListener('click', handleClosure)
window.addEventListener('focusin', handleClosure)
```

It works more or less like this: we listen for click events and focus change on the window object. When clicking or focusing an element that is **not** contained within the menu element, we close the menu. You’ll notice we don’t actually check whether the menu is open or not before we try closing it, because it makes little to no difference, performance wise.

One important thing to point out: we have to stop the propagationg of the click event on the toggle itself. Otherwise, it goes up to the window click listener, and since the toggle is not contained within the menu, it would close the latter as soon as we try to open it.

{% info %} We originally used [`Event.composedPath`](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath), which provides the DOM path from the root of the document to the event target. Unfortunately, we noticed it wasn’t supported in many cases, so we had to revisit the implementation. {% endinfo %}

## React

Our implementation is actually in React, so I might as well share it. We use [react-a11y-disclosure](https://github.com/KittyGiraudel/react-a11y-disclosure) to handle the disclosure pattern for us, but I skipped it here for sake of simplicity.

```jsx
const useAutoClose = ({ setIsOpen, menu }) => {
  const handleClosure = React.useCallback(
    event => !menu.current.contains(event.target) && setIsOpen(false),
    [setIsOpen, menu]
  )

  React.useEffect(() => {
    window.addEventListener('click', handleClosure)
    window.addEventListener('focusin', handleClosure)

    return () => {
      window.removeEventListener('click', handleClosure)
      window.removeEventListener('focusin', handleClosure)
    }
  }, [handleClosure, menu])
}

const Menu = props => {
  const menu = React.useRef()
  const [isOpen, setIsOpen] = React.useState(false)

  useAutoClose({ setIsOpen, menu })

  return (
    <nav role='navigation'>
      <button
        type='button'
        id='nav-toggle'
        aria-expanded={isOpen}
        aria-controls='nav-content'
        onClick={event => {
          event.stopPropagation()
          setIsOpen(isOpen => !isOpen)
        }}
      >
        Navigation
      </button>
      <div id='nav-content' aria-hidden={!isOpen} aria-labelledby='nav-toggle'>
        <ul>
          <li>
            <a href='#'>Link 1</a>
          </li>
          <li>
            <a href='#'>Link 2</a>
          </li>
          <li>
            <a href='#'>Link 3</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
```

That’s it. Relatively simple in the end. For a more comprehensive solution, one might want to check [react-outside-click-handler](https://github.com/airbnb/react-outside-click-handler) from AirBnB but truth be told, I don’t know what it does that this solution doesn’t do. Anyway, I hope it helps! 💖
