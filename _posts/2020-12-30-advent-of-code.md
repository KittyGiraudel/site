---
title: 'My thoughts on Advent of Code'
---

I had some time off in December, so I decided to participate in [Advent of Code](https://adventofcode.com/). If you are unfamiliar with it, it is a series of daily coding/logic puzzles made of two parts, the second usually a twist on the former. Advent of Code has been running for 5 years now, and while I did attempt it last year, I gave up after a few days for lack of time.

I originally wrote a long article about my thoughts on every individual puzzle, but I realised truly nobody cared, so I’m swapping it for a quick draft of my thoughts on the event as a whole.

## Input parsing

In the early days, I stumbled upon a problem where my tests were passing, but I could not get the correct result for my puzzle input. It turns out I had a trailing line in my input file, leading to hard-to-track errors down the line. I then tweaked my function which reads the input file so it trims the data:

```js
const fs = require('fs')
const path = require('path')

module.exports = (dir, delimiter = '\n') =>
  fs
    .readFileSync(path.resolve(dir + '/input.txt'), 'utf8')
    .trim()
    .split(delimiter)
```

## Performance

Each puzzle goes like this: you have a short story which contains rules. These rules are not always super straightforward (I’m looking at you [day 17](https://adventofcode.com/2020/day/17) and your obscure example), so it is important to read them carefully in order not to miss any subtlety. The first part is usually relatively easy to reach regardless of the implementation. Then the 2nd part tends to be more demanding and some code might need to be rewritten.

I felt like a lot of the difficulty came from performance (or lack thereof). Most puzzles are relatively straightforward to solve, but when pushed to the extreme in part 2, a naive approach tends to be too slow. It wasn’t uncommon to have million (or more) iterations or recursions, which eventually becomes quite computer intensive.

For instance, both [day 15](https://adventofcode.com/2020/day/15) and [day 23](https://adventofcode.com/2020/day/23) were infinite number games, which were simple and quick in part 1 but required computing a very large number of rounds (10,000,000 if I’m not mistaken) for part 2. The naive array-based implementation worked fine to begin with, and completely collapsed later on when it cannot output a result within hours (!!). Rewriting the code using a hash table (such as an object or a `Map`) yields dramatic performance improvements, solving the puzzle within 10 seconds. Rewriting the code _again_ using an `UInt32Array` brings down computation time within a single second.

Not everything has to be brute-forced, but ultimately everything is. Some puzzles could be solved efficiently in very clever ways such as using the Chinese Remainder Theorem in [day 13](https://adventofcode.com/2020/day/13), or bitwise operators in [day 14](https://adventofcode.com/2020/day/14), but unless one has some relatively advanced math and/or computer science knowledge, such solution is most likely out of reach. As a result, we resort to brute-forcing, and this is when performance can be an issue—because these problems are better solved otherwise.

## Tests

Test-driven implementation truly is a blessing for this event because the daily puzzles contain short data samples and their expected results. My approach was always to write the unit tests (with [Ava](https://github.com/avajs/ava)) for the samples, then write the code until the tests pass, and finally run the code on my puzzle input.

```js
const test = require('ava')
const { getGameScore, fightRecursive } = require('.')
const input = require('../helpers/readInput')(__dirname, '\n\n')

const example = ['Player 1:\n9\n2\n6\n3\n1', 'Player 2:\n5\n8\n4\n7\n10']

test('Day 22.1', t => {
  t.is(getGameScore(example), 306)
})

test('Day 22.2', t => {
  t.is(getGameScore(example, fightRecursive), 291)
})

test('Day 22 — Solutions', t => {
  t.is(getGameScore(input), 34664)
  t.is(getGameScore(input, fightRecursive), 32018)
})
```

## Wrapping up

Overall, it was a lot of fun. Difficult varied greatly from day to day which was pretty interesting, and besides [day 20](https://adventofcode.com/2020/day/20) which was an absolute nightmare, I enjoyed solving the daily puzzle.

My favourite ones were:

- [Day 18](https://adventofcode.com/2020/day/18) which required evaluating mathematical expressions while challenging the natural resolution order (e.g. additions before multiplications).
- [Day 22](https://adventofcode.com/2020/day/22), a recursive War-like card game where 2 players battle each other until one of them owns all cards in the deck.
- [Day 24](https://adventofcode.com/2020/day/24) because it involved navigating a hexagonal grid, which presents some challenges (all solved by this incredible [guide of hexagonal grids](https://www.redblobgames.com/grids/hexagons/)).

But I have to say what I enjoyed the most was browsing [r/AdventOfCode](https://www.reddit.com/r/adventofcode/) and be amazed by the creativity of some participants. It truly is wonderful. :)
