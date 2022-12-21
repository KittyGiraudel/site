---
title: Reverse-engineering an AoC problem
---

[Today’s Advent of Code](https://adventofcode.com/2022/day/21) (day 21 2022) was probably my favorite of the lot. I guess it’s a combination of having managed to solve it without relying on Reddit, having managed to solved it both manually _and_ programmatically, and having learnt things along the way.

Here is a technical write-up of my journey through that puzzle.

## Part 1

The first thing I’m happy about is that I managed to solve part 1 _very_ rapidly. And that’s only because a former Advent of Code event had a similar problem which I couldn’t solve back then. It feels nice realising that I learn stuff. 😅

Let’s go through it.

First, we parse the input file into an object where keys are the name of our variables, and values are the numbers or expressions. Something like this:

```js
{
  "root": "pppw + sjmn",
  "dbpl": 5,
  …
}
```

This first step can be done in plenty different ways, but I’m used to `Array.prototype.reduce`, so here goes:

```js
const parseInput = input =>
  input.reduce((acc, line) => {
    const [name, value] = line.split(': ')
    acc[name] = +value || value
    return acc
  }, {})
```

Once we have our map, the logic goes like this:

1. Find any key that has a numeric value (not an expression).
2. Look for that key in all the other values, and replace it with the actual number.
3. If the updated expression no longer contains names and only numbers, evaluate it.
4. Remove the key from the map now that it has been processed.
5. Repeat until we have found the number for the value mapped to the `root` key.

The code goes like this:

```js
const getRootNumber = input => {
  const map = parseInput(input)

  while (typeof map.root !== 'number') reduceNext(map)

  return map.root
}

const getNextNumber = map =>
  Object.entries(map).find(([, value]) => typeof value === 'number')

const reduceNext = map => {
  const [nextKey, nextValue] = getNextNumber(map)

  for (let key in map) {
    const value = map[key]

    if (typeof value === 'string' && value.includes(nextKey)) {
      map[key] = value.replace(nextKey, nextValue)
      // This is not the most elegant, but it does the job. If the
      // expression contains only numbers (e.g. `2 + 3`), it will
      // resolve it (e.g. `5`), otherwise (e.g. `2 + eklr`), it will
      // fail and do nothing.
      try {
        map[key] = eval(map[key])
      } catch {}
    }
  }

  delete map[nextKey]
}
```

## Part 2: the naive way

Part 2 ups the ante: instead of finding the value of the `root` key, we need to figure out which value for the `humn` key would yield the right value to trickle down to the `root` key.

Initially, I wasn’t too bothered by it. I thought I could reuse the code I wrote for part 1 by changing the value of the `humn` key every time until we find the value that yields the correct result. My code looked a bit like this (follow along in the comments):

```js
const getHumnNumberByBruteForce = input => {
  let map = parseInput(input)

  // We remove the `humn` key since it’s the actual key we are trying
  // to figure out the value from.
  delete map.humn

  // While the exercise says to replace the `+` with an equality check
  // (`==`) in the `root` value, we can instead replace it with a `-`
  // sign so it returns `0` when we find the right value (e.g.
  // `23622695042414 - 23622695042414`). This enables us to reuse the
  // code from part 1 (which checks whether the `root` value is a
  // finally a number).
  map.root = map.root.replace('+', '-')

  // To speed things up, we first reduce the map as much as we can.
  // Basically we deal with all keys which are mapped to numbers right
  // away, so that we only focus on the dynamic expressions in the
  // next loop.
  while (getNextNumber(map)) reduceNext(map)

  // We start our `humn` value at 0, run the code from part 1, and if
  // it returns anything else but 0, we increment `humn` and repeat
  // until we found the value that works.
  let humn = 0
  while (getRootNumber({ ...map, humn }) !== 0) humn++

  return humn
}
```

Let’s start by saying that this code actually works. It yields the right result for the sample. The problem is that it’s unrealistic to hope to brute-force part 2 considering the answer has something like 14 digits. I went all the way up to 1,000,000 iterations in a few minutes until I decided to start looking at the numbers a little closer.

I put a `console.log` right when we replace the last variable in the `root` value. At this point, I’ve noticed that the `root` value is an expression like this: `root = lrnp === 23622695042414`. I’ve also noticed that even with a `humn` value of 1,000,000+, I was very _very_ far from matching that number.

So I kind of poked around manually by killing the process, updating the starting value of `humn` to a super large number, and checking the log again to see how far I was. I’ve done that a few times, getting closer each time until my brute-force program managed to return the right result in a few seconds once the starting `humn` value was close enough to the actual one.

## Part 2: the manual way

Even though I managed to solve it with manually-assisted brute-force, I was curious how to figure it out the Right Way™. My gut feeling was that we may need to look at the input data instead, and find some sort of clue with the numbers.

So I printed the reduced map (the one with only ~80 expressions instead of 5000). I removed all punctuation symbols for clarity and ordered the operations from `root` to `humn` in a text file, like this:

```
root = lrnp === 23622695042414
lrnp = gdgf / 4
gdgf = 886 + zlwm
zlwm = 2 * pjcb
pjcb = 117205375899188 - mfvj
mfvj = 3 * hgfj
…
qdlz = 21 * dztn
dztn = 452 + humn
```

From there, I solved the equation manually by starting from the end value (`23622695042414`), and applying each operation line by line (reversed though!). For instance, here is the logic for the first few lines:

1. We know we need `lrnp` to be `23622695042414` for the `root` expression to be truthy.
2. We know `lrnp = gdgf / 4`. Therefore, `gdgf = lrnp * 4`. So `gdgf` is `23622695042414 * 4` or `94490780169656`.
3. We know `gdgf = zlwm + 886`. Therefore, `zlwm = gdgf - 886`. So `zlwm` is `94490780169656 - 886` or `94490780168770`.
4. We know `pjcb = gdgf * 2`. Therefore `gdgf = pjcb / 2`. So `pjcb` is `94490780168770 / 2`, or `47245390084385`.
5. We know `mfvj = 117205375899188 - pjcb`, so `117205375899188 - 47245390084385`, or `69959985814803`.

And so on until we reach a value for `humn` (`3429411069028` in my case). We basically reverse-engineered the formula by hand.

## Part 2: the automated way

Of course doing it by hand is pretty cumbersome, not to mention error-prone. I had to start again twice because I made silly math mistakes. So we should try to write a function to do that for us.

Our function starts very similarly to the naive brute-force attempt: we parse the input into a map, remove the `humn` key (since we’re looking for it), then reduce the map as much as possible so we get rid of all numeric values and have only expressions left.

Then we read the `root` value as an entry point. This gives us the next key we should resolve (`lrnp`), and the initial numeric value we work from (`23622695042414`).

Then, we keep iterating until we have found the `humn` key, updating our value along the way by **reversing** the operation (if `a = b * 2`, then `b = a / 2`). Ultimately, we end up with our result!

```js
const getHumnNumber = input => {
  const map = parseInput(input)
  delete map.humn

  while (getNextNumber(map)) reduceNext(map)

  let value = +map.root.match(/(\d+)/)[1]
  let curr = map.root.match(/([a-z]+)/)[1]

  // We walk down the operation chain until we reach the `humn` key.
  // The idea is that we reverse the current operation to find the
  // previous number. For instance if we have `a = b / 4`, we can find
  // `b` (the next one), by multiplying the current value by 4
  // (`b = a * 4`).
  while (curr !== 'humn') {
    const [a, operator, b] = map[curr].split(' ')

    // Expressions are always made of 1 number and 1 variable, but the
    // order is not guaranted. So we need to check both to figure out
    // which is which.
    const next = isNaN(Number(a)) ? a : b
    const number = !isNaN(Number(b)) ? Number(b) : Number(a)

    if (operator === '*') value /= number
    if (operator === '+') value -= number

    // Small edge cases to deal with: if the expression is in the form
    // of `a = x - b` or `a = x / b` where x is the number, the
    // operation should actually *not* be reversed but kept as is.
    // E.g. 10 = 20 / b is the same as b = 20 / 10, not b = 10 / 20
    // E.g. 10 = 20 - b is the same as b = 20 - 10, not b = 10 - 20
    if (operator === '/') {
      if (!isNaN(Number(a))) value = number / value
      else value *= number
    }

    if (operator === '-') {
      if (!isNaN(Number(a))) value = number - value
      else value += number
    }

    curr = next
  }

  return value
}
```

## A better approach

I like to read through the thread of answers on Reddit to learn how people solved problems.

Today, most people performed a binary search, which is a clever way to work around the performance problems of our naive brute-force solution. Basically the idea is to compose a mega math expression to begin with, and then to execute it with carefully selected values until we find the right result.

The expression can be generated relatively conveniently from our map:

```js
const getExpression = (map, key = 'root') => {
  const value = (map[key] || key).split(' ')
  return value.length === 1
    ? value
    : '(' + value.map(p => getExpression(map, p)).join(' ') + ')'
}
```

When executed against the reduced map (the one with only expressions), it spits out a monstrosity like this, with the `humn` variable in the middle.

```
((886 + (2 * (117205375899188 - (3 * (((((((((338 + (((5 * (995 + (((((2 * (((((694 + ((7 + (((5 * (((858 + (((815 + (((((2 * (282 + ((528 + (((4 * (((((2 * ((((((2 * (867 + (((21 * (452 + humn)) - 886) / 2))) - 513) / 5) + 859) / 2) - 153)) - 727) + 677) / 2) + 343)) - 287) * 4)) / 4))) - 852) / 10) - 542) * 17)) / 2) + 922)) / 7) - 854)) - 175) / 5)) * 2)) * 9) - 972) / 3) + 51)) - 850) / 2) - 388) / 2))) - 171) * 2)) / 2) + 853) / 3) - 789) * 2) - 118) / 3) + 155))))) / 4) - 23622695042414
```

From there, the idea of a binary search (from what I understand of it) is that you start with a very very high value to make sure you hit too high. Then you divide your value by 2 and you try again. Depending on whether you hit too high or too low, you divide the relevant gap by 2 again and again until you find the right value.

For instance if you’re asked to guess for a number between 0 and 100 and all you get is “higher” or “lower”, you start by saying 50 (half the gap). If you hear “higher”, you then ask 75 (half the gap). If you hear “lower”, you ask 62 or 63 (half the gap), and so on.

It’s generally very very fast and efficient. Significantly more than my version (which takes about 1 second to run on my M1 laptop).

## Wrapping up

So I ended up solving this one 3 times: one time by combining brute-force with some manual poking around (my own clumsy version of binary searching), one time by hand entirely, and one time programmatically from what I learnt in the manual version. And then after that I learnt more about implementing a binary search by reading other people’s solution.

It felt very good getting to the bottom of it and was pretty fun overall! ✨
