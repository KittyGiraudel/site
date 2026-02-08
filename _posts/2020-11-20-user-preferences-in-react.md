---
title: User preferences in React
description: A technical write-up on React hooks and components for user preferences like dark mode and reduced motion
keywords:
- react
- preferences
- media
---

I have recently been playing with a concept of React hooks and React components to handle user preferences such as light/dark mode, reduced motion, reduced data usage, reduced transparency, or basically anything else.

{% info %}
You might be interested in reading [Implementing a reduced motion mode](/2018/03/19/implementing-a-reduced-motion-mode/) where I go in details on how to use the OS preference alongside CSS custom properties to manage motion preferences.
{% endinfo %}

The idea is to provide an easy way to access this information, and react (no pun intended) to it would it change thanks to media queries. It could be either a React hook to abstract that away, or a React component for a very declarative approach like below.

```jsx
const ThankYouPage = props => (
  <>
    <p>Thank you for subscribing to our newsletter!</p>
    <Settings.WithMotion>
      <img src='./assets/party.gif' alt='Cat chasing confettis'>
    </Settings.WithMotion>
  </>
)
```

Our `Settings` object (sometimes called `Only`) could hold several React component such as `WithMotion`, `WithoutMotion`, `WithTransparency`, `LightMode`, `WithReducedData`…

They would all essentially be based on a `useMatchMedia` hook. It would query the browser for a certain preference, listen for any change, and set it in a local state for convenience.

```js
const useMatchMedia = (query, defaultValue = false) => {
  const [matches, setMatches] = React.useState(defaultValue);

  React.useEffect(() => {
    const q = window.matchMedia(query);
    const onChange = ({ matches }) => setMatches(matches);
    onChange(q);
    q.addListener(onChange);
    return () => q.removeListener(onChange);
  }, [query]);

  return matches;
};
```

From there, creating our React component is pretty straightforward:

```jsx
export const Settings = {};

const WithMotion = ({ children }) =>
  useMatchMedia("(prefers-reduced-motion: no-preference)") ? children : null;

const WithoutMotion = ({ children }) =>
  useMatchMedia("(prefers-reduced-motion: reduce)") ? children : null;

const WithReducedData = ({ children }) =>
  useMatchMedia("(prefers-reduced-data: reduce)") ? children : null;

const WithReducedTransparency = ({ children }) =>
  useMatchMedia("(prefers-reduced-transparency: reduce)") ? children : null;

const DarkMode = ({ children }) =>
  useMatchMedia("(prefers-color-scheme: dark)") ? children : null;

const LightMode = ({ children }) =>
  useMatchMedia("(prefers-color-scheme: light)") ? children : null;

Settings.WithMotion = WithMotion;
Settings.WithoutMotion = WithoutMotion;
Settings.WithReducedData = WithReducedData;
Settings.WithReducedTransparency = WithReducedTransparency;
Settings.DarkMode = DarkMode;
Settings.LightMode = LightMode;
```

At this stage, we could add as many options as we want: viewport size, device type, contrast preference… There are a lot of possibilities.

If you prefer hooks to React components, you could write small wrapper hooks for every individual preference:

```js
const useMotionPreference = () => {
  const prefersReducedMotion = useMatchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Or really any API you would like… A few ideas:
  // - `reduce` vs `no-preference` to match the CSS spec
  // - `on` vs `off`
  // - just a boolean instead
  return prefersReducedMotion ? "reduced" : "default";
};

const useColorScheme = () =>
  useMatchMedia("(prefers-color-schema: dark)") ? "dark" : "light";
```

---

I hope you like the idea! Adapting to users’ preferences is not only a good design principle, it can also help with accessibility (for instance, disabled animations for people suffering from vestibular disorder). If you are going to rely on the operating system’s preferences, be sure to provide a way to still customise them on a per website basis.

If you are interested in the intersection of React code and web accessibility, be sure to have a look at the following articles:

- [Accessible page title in a single-page React application](/2020/01/15/accessible-title-in-a-single-page-react-application/)
- [An accessible visibility React component](/2020/01/16/accessible-visibility-react-component/)
- [Accessible links and buttons with React](/2020/01/17/accessible-links-and-buttons-with-react/)
