---
title: Code for edge cases
description: A reflection on coding for edge cases and defensive programming
keywords:
  - code
  - edge case
  - javascript
  - function
---

Lately I have been writing tests for a large JavaScript project. When testing helper functions, it occurred to me developers usually write the code for the perfect scenario without considering anything that could go wrong.

Let’s imagine we have a function to make a salad. This function expects an array of ingredients, put them together and return the result. In JavaScript, its simplest form would be:

```js
function makeSalad(ingredients) {
  return ingredients.join(', ')
}
```

Alright, we can now create a salad:

```js
var salad = makeSalad(['lettuce', 'tomatoes', 'sauce'])
// -> "lettuce, tomatoes, sauce"
```

Very good. Now what happens if we call `makeSalad(..)` without any ingredients? Or if we call `makeSalad(..)` with something else than ingredients? Well let’s see.

```js
var salad = makeSalad()
// -> Error: Cannot read property 'join' of undefined
```

Indeed. Because we did not pass `ingredients`, its value is `undefined` which does not have a `join(..)` function. A simple fix would be to set a default value for `ingredients`.

```js
// ES6
function makeSalad(ingredients = []) {
  return ingredients.join(', ')
}

// ES5
function makeSalad(ingredients) {
  ingredients = ingredients || []
  return ingredients.join(', ')
}
```

Now we can safely make our salad without passing any ingredients without risking a script crash. It will return an empty string. Given that the function usually returns a string, that seems like a valid way of handling this edge case.

```js
var salad = makeSalad()
// -> ""
```

Now what about the case where we pass something else than an array?

```js
var salad = makeSalad({
  lettuce: 'a lot',
  tomatoes: 2,
  sauce: '3 tea spoons',
})
// -> Error: ingredients.join is not a function
```

Again, `ingredients` is an object and an object does not have a `join(..)` function. To prevent this code from failing, we could add an extra check to our function to make sure that the given arguments is an array.

```js
function makeSalad(ingredients) {
  ingredients = ingredients || []

  if (!Array.isArray(ingredients)) {
    throw new TypeError('`ingredients` parameter should be an array.')
  }

  return ingredients.join(', ')
}
```

In this case, the script will still throw an error but the error will be very explicit, which is much better for catching and debugging.

```js
var salad = makeSalad({
  lettuce: 'a lot',
  tomatoes: 2,
  sauce: '3 tea spoons',
})
// -> TypeError: `ingredients` parameter should be an array.
```

Long story short: handle edge cases in your functions. Don’t assume anything, and provide meaningful fallbacks and errors.
