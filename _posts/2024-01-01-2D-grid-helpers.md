---
title: 2D-Grid helpers
description: A technical write-up on the 2D-Grid helpers I wrote for the Advent of Code puzzles
---

December is the month of [Advent of Code](https://adventofcode.com/), and with it came a lot of coding puzzles involving 2D-grids. I had a bucket of helpers under my belt, but decided to consolidate and improve them at the end of December. In this post, we’ll walk through the code ([find it on GitHub](https://github.com/KittyGiraudel/advent-of-code/blob/main/helpers/Grid.ts)).

Formerly, I used to have a lot of pure functions which accepted a bi-dimensional array, but I decided that using a Grid class would be better as it could keep track of its own data, and offer plenty methods to access and manipulate it.

- [Terminology](#terminology)
- [Instantiating a grid](#instantiating-a-grid)
- [Getting dimensions](#getting-dimensions)
- [Accessing data](#accessing-data)
- [Writing data](#writing-data)
- [Iterating over the grid](#iterating-over-the-grid)
- [Rotating the grid](#rotating-the-grid)
- [Rendering the grid](#rendering-the-grid)
- [Full example](#full-example)
- [Wrapping up](#wrapping-up)

## Terminology

To represent a pair of coordinates, we’ll use a `Coords` type. It’s an alias for `[number, number]` where the first value is the row index (`ri`, or Y in a traditional coordinate system) and the second value the column index (`ci`, or X).

Because JavaScript doesn’t have a native tuple type which can be used in maps, arrays and sets, we have to resort to using a string representation of our coordinates. This is our `Point` type, which is `${number},${number}`.

Additionally, we have helpers `toPoint` and `toCoords` to convert a `Coords` into a `Point` and a `Point` into a `Coords` respectively.

```ts
type Coords = [number, number]
type Point = `${number},${number}`

const toPoint = (input: Coords) => input.join(',') as Point
const toCoords = (input: Point) => input.split(',').map(Number) as Coords
```

{% info %} Throughout the code, I will use `ri` (row index) and `ci` (column index) in place of Y and X respectively. I tend to find the code easier to understand when thinking in rows and columns rather than using the X,Y coordinate system. Coincidently, I express coordinates as Y,X (ri,ci) since I bi-dimensional arrays are read row-first, and then column.{% endinfo %}

## Instantiating a grid

Our Grid class really is a wrapper around a bi-dimensional array. It can be instantiated with dimensions, and an optional setter which receives the row indew and the column index.

```ts
class Grid<T> {
  private data: T[][]

  constructor(
    width: number,
    height: number,
    value: T | null | ((coords: Coords) => T) = null
  ) {
    this.data = Array.from({ length: height }, (_, ri) =>
      Array.from({ length: width }, (_, ci) =>
        typeof value === 'function'
          ? (value as CallableFunction)([ri, ci])
          : value
      )
    )
  }

  get rows() {
    return this.data
  }

  get columns() {
    return Array.from({ length: this.width }, (_, ci) =>
      this.rows.map(row => row.at(ci) as T)
    )
  }

  // More to come …
}

// Examples
const grid = new Grid(0) // 0x0 grid
const grid = new Grid(3) // 3x3 grid
const grid = new Grid(5, 3) // 3x5 grid
const grid = new Grid(5, 3, null) // 3x5 grid with `null` everywhere
const grid = new Grid(5, 3, (ri, ci) => {
  // Initialize the cell at ri,ci to the return value from this functon
})
```

What I noticed with Advent of Code is that more often than not it is interesting to be able to instantiate a grid from an existing data structure; either a bi-dimensional array already, or an array of strings (where each string will be considered a row, with one column per character).

For these cases, I came up with 2 static methods which return a grid instance. There is a lot going on but it’s mostly TypeScript shenanigans. The `from` method reads the width and height from the input and instantiate a grid with it. The `fromRows` method uses the `from` static method to instantiate a grid.

```ts
type Mapper<I, O> = (value: I, coords: Coords) => O

const identity = <I, O>(value: I, coords: Coords) => value as unknown as O

class Grid<T> {
  // …

  static from<I, O = I>(input: I[][], mapper: Mapper<I, O> = identity) {
    return new Grid<O>(input[0].length, input.length, ([ri, ci]) =>
      mapper(input[ri][ci], [ri, ci])
    )
  }

  static fromRows<O = string>(
    input: string[],
    mapper: Mapper<string, O> = identity
  ) {
    return Grid.from(
      input.map(row => Array.from(row)),
      mapper
    )
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)
/**
 *  [ [ 1, 2, 3 ]
 *    [ 4, 5, 6 ]
 *    [ 7, 8, 9 ] ]
 */
```

## Getting dimensions

Now that we have solid ways to instantiate grids, we can write getters to retrieve their dimensions. They are pretty straightforward:

```ts
class Grid<T> {
  // …

  get width() {
    return this.data.length ? this.data[0].length : 0
  }

  get height() {
    return this.data.length
  }
}

// Examples
const grid = Grid.fromRows('12\n45\n78'.split('\n'), Number)
console.assert(grid.width === 2)
console.assert(grid.height === 3)
```

## Accessing data

Then, we need a way to read the value stored at a set of coordinates.

```ts
class Grid<T> {
  // …

  get(position: Point | Coords) {
    const [ri, ci] =
      typeof position === 'string' ? toCoords(position) : position

    return this.data?.[ri]?.[ci]
  }

  at(position: Point | Coords) {
    return this.get(position)
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)
const topLeft = grid.at('0,0') // 1
const center = grid.at([1, 1]) // 5
const outOfBound = grid.at([10, 10]) // undefined
```

I decided _not_ to throw an error when attempting to access a cell that’s out of bound. It would probably be safer to warn or throw, but in the scope of Advent of Code, there were plenty cases where we just want to return `undefined` instead.

## Writing data

When _setting_ a value though, we do want to make sure the coordinates exist in the grid. This is how it looks like:

```ts
class Grid<T> {
  // …

  set(position: Point | Coords, value: T) {
    const [ri, ci] =
      typeof position === 'string' ? toCoords(position) : position

    if (ri < 0 || ri > this.height - 1) {
      throw new Error(
        `Cannot set value at position ${position} since row ${ri} is out of bound for grid of height ${this.height}.`
      )
    }

    if (ci < 0 || ci > this.width - 1) {
      throw new Error(
        `Cannot set value at position ${position} since column ${ci} is out of bound for grid of width ${this.width}.`
      )
    }

    this.data[ri][ci] = value

    return this
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)
grid.set('0,0', 'A').set([1, 1], 'E')
grid.set([10, 10], 'Z') // Throws because out of bound
```

## Iterating over the grid

In most cases, we want to be able to iterate on our grid though. We’re going to implement most array methods like `forEach`, `map`, `filter`, `every`… Let’s start with `forEach`. We’re going to make sure the function we pass to all these methods have a single signature so they’re easy to use. It should accept the current cell value (what’s actually stored in the grid cell), and its coordinates.

```ts
class Grid<T> {
  // …

  forEach(handler: (item: T, coords: Coords) => void) {
    this.rows.forEach((row, ri) =>
      row.forEach((value, ci) => handler(value, [ri, ci]))
    )
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)

grid.forEach((value, coords) => {
  console.log('Value at', coords, 'is', value)
})
```

Now, mapping. Mapping is a bit special because the goal is to modify the grid values by applying the given function onto them. `Array.prototype.map` returns a new array though, so we probably should do the same. `Grid.prototype.map` should return a new grid.

```ts
class Grid<T> {
  // …

  map<O>(handler: (item: T, coords: Coords) => O) {
    const next = Grid.from(this.data) as Grid<O>

    this.forEach((value, coords) => next.set(coords, handler(value, coords)))

    return next
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)
const next = grid.map((value, coords) => value * value)
/**
 *  [ [  1,  4,  9 ]
 *    [ 16, 25, 36 ]
 *    [ 49, 64, 81 ] ]
 */
```

Next, reducing the grid into a single value. It works the same way as `Array.prototype.reduce`: it takes a reducer function which handles an accumulator value, and an initial value for the accumulator.

```ts
class Grid<T> {
  // …

  reduce<O>(handler: (acc: O, item: T, coords: Coords) => O, initialValue: O) {
    return this.data.reduce(
      (accRow, row, ri) =>
        row.reduce(
          (accCol, item, ci) => handler(accCol, item, [ri, ci]),
          accRow
        ),
      initialValue
    )
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)

grid.reduce((total, value, coords) => total + value) // 45
```

We can use that new `reduce` method to build another thing that can be handy: a function that finds the coordinates matching the given predicate. Call it `findCoords`.

```ts
class Grid<T> {
  // …

  findCoords(predicate: (item: T, coords: Coords) => boolean) {
    return this.reduce<Coords | undefined>(
      (acc, item, coords) => acc ?? (predicate(item, coords) ? coords : acc),
      undefined
    )
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)

grid.findCoords(value => value === 7) // [2, 0]
```

Writing a `find` method becomes very easy now that we have this one:

```ts
class Grid<T> {
  // …

  find(predicate: (item: T, coords: Coords) => boolean) {
    const coords = this.findCoords(predicate)
    return coords ? this.get(coords) : undefined
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)

grid.find((_, [ri, ci]) => ri === ci) // 1 (not super useful example)
```

Although there are certainly more methods we can write, let’s end the iterating section with `filter`. Especially since it wasn’t the most straightforward to write (and there are more than one ways to author it). The idea is to remove all non-passing values from every row, then remove empty rows, then flatten all rows into a single array.

```ts
class Grid<T> {
  // …

  filter(predicate: (item: T, coords: Coords) => boolean) {
    return this.rows
      .map((row, ri) => row.filter((value, ci) => predicate(value, [ri, ci])))
      .filter(row => row.length > 0)
      .flat()
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)

grid.filter(value => value % 3 === 0) // [3, 6, 9]
```

## Rotating the grid

I won’t go too deep into the next piece of code, mainly because I’ve written that a while ago and I’m not 100% sure on how it works — rotating matrices has never been my forte. Anyway, it provides a couple of methods to manipulate the data: `rotate`, `flip`, and `variants` to get all the possible rotations/flips of the grid.

```ts
class Grid<T> {
  // …

  clone() {
    return Grid.from(structuredClone(this.data))
  }

  rotate() {
    const next = new Grid<T>(0)

    this.columns.forEach((_, ci) => {
      next.rows.push(this.rows.map(row => row[ci]).reverse())
    })

    return next
  }

  flip() {
    const flipped = this.clone()

    flipped.rows.reverse()

    return flipped
  }

  variants() {
    const variants: Grid<T>[] = []

    const rotate = (rotations: number = 0) => {
      let grid = this.clone()
      for (let i = 0; i < rotations; i++) grid = grid.rotate()
      return grid
    }

    for (let i = 0; i <= 3; i++) {
      const rotated = rotate(i)
      const flipped = rotated.flip()
      variants.push(rotated)
      variants.push(flipped)
    }

    return variants
  }
}
```

## Rendering the grid

It can be useful to log the grid for debugging purposes. We can write a little `render` function that serializes the grid for console output:

```ts
class Grid<T> {
  // …

  render(
    separator: string = '',
    mapper: (value: T) => string = value => String(value)
  ) {
    return this.rows.map(row => row.map(mapper).join(separator)).join('\n')
  }
}

// Examples
const grid = Grid.fromRows('123\n456\n789'.split('\n'), Number)

console.log(grid.render(' '))
/**
1 2 3
4 5 6
7 8 9
*/
```

## Full example

Let’s take[ Day 11 2021 from Avent of Code](https://adventofcode.com/2021/day/11) as an example. Our input is the following multi-line string of numbers:

```
7222221271
6463754232
3373484684
4674461265
1187834788
1175316351
8211411846
4657828333
5286325337
5771324832
```

The exercise is, I quote:

> There are 100 octopuses arranged neatly in a 10 by 10 grid. Each octopus slowly gains energy over time and flashes brightly for a moment when its energy is full. Although your lights are off, maybe you could navigate through the cave without disturbing the octopuses if you could predict when the flashes of light will happen.
>
> Each octopus has an energy level. The energy level of each octopus is a value between 0 and 9. Here, the top-left octopus has an energy level of 7, the bottom-right one has an energy level of 2, and so on. You can model the energy levels and flashes of light in steps. During a single step, the following occurs:
>
> 1. First, the energy level of each octopus increases by 1.
> 2. Then, any octopus with an energy level greater than 9 flashes. This increases the energy level of all adjacent octopuses by 1, including octopuses that are diagonally adjacent. If this causes an octopus to have an energy level greater than 9, it also flashes. This process continues as long as new octopuses keep having their energy level increased beyond 9. (An octopus can only flash at most once per step.)
> 3. Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash. Adjacent flashes can cause an octopus to flash on a step even if it begins that step with very little energy.
>
> Given the starting energy levels of the dumbo octopuses in your cavern, simulate 100 steps. How many total flashes are there after 100 steps?

To count the flashes and solve the puzzle, we are going to start by instantiating a grid from the give input. We will make good use of the mapper parameter to transform each cell into an object instead of just a numeric value. Then we’ll simulate 100 cycles and accumulate the amount of flashes as we go.

```ts
type Octopus = { value: number; flashed: boolean }

const countFlashes = (input: string) => {
  const grid = Grid.fromRows<Octopus>(input.split('\n'), value => ({
    value: +value,
    flashed: false,
  }))

  let flashes = 0

  for (let i = 0; i < 100; i++) flashes += cycle(grid)

  return flashes
}
```

The `cycle` function implements the puzzle rules, making good use of our iteration methods (`forEach`, and `count` which we haven’t implemented here):

```ts
const cycle = (grid: Grid<Octopus>) => {
  // 1. Increment the energy value of each octopus
  grid.forEach(octopus => octopus.value++)

  // 2. Process the flashes (recursively)
  processFlashes(grid)

  // 2b. Count how many octopuses flashed
  const flashes = grid.count(octopus => octopus.flashed)

  // 3. Reset the octopuses that flashed
  grid.forEach(octopus => {
    octopus.flashed = false
    if (octopus.value > 9) octopus.value = 0
  })

  return flashes
}
```

The missing miece is our `processFlashes` function:

```ts
const processFlashes = (grid: Grid<Octopus>) => {
  const toIncrement: Coords[] = []

  grid.forEach((octopus, coords) => {
    if (!octopus.flashed && octopus.value > 9) {
      octopus.flashed = true
      // Not implemented here: the `surrounding` helper function returns the 8
      // sets of coordinates surrounding the given set of coordinates
      toIncrement.push(...surrounding(coords))
    }
  })

  toIncrement.forEach(coords => {
    const octopus = grid.get(coords)
    if (octopus) octopus.value++
  })

  if (toIncrement.length > 0) processFlashes(grid)
}
```

## Wrapping up

That’s basically the gist of it, although there are many more things we can do (some of them already implemented in the GitHub version):

- Provide additional iteration methods like `every`, `everyColumn`, `everyRow`, `some`, `someColumn`, `someRow`…
- Provide some methods to append and prepend entire rows and columns to the grid.
- Provide a method to convert the grid into an object or a Map for faster lookups, which can matter when performing pathfinding.

I hope this helps!
