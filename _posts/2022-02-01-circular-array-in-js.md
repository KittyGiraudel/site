---
title: Circular array in JavaScript
---

I have been having fun with [Advent of Code](https://adventofcode.com/) recently. A few of the problems required some more advanced data structures than what JavaScript natively provides, such as linked lists, double-ended queues and circular arrays.

Disclaimer: I have no Computer Science degree. I have been doing frontend development for the last 10 years, a discipline you rarely need linked lists for. So take my suggestions here with a grain of salt.

A circular array is just that. A collection of items that loops on itself so that the last element connects to the first. This can be pretty handy in games and problems based on a circular structure (such as the [Josephus problem](#example) or the popular mobile game [Atomas](http://sirnic.com/atomas/)). For instance:

```
   (1) 2
  6      3   →   … 6 (1) 2 …
    5  4
```

In this article, I’ll walk you through my implementation. If you just want to see the code, check the [circularr](https://github.com/KittyGiraudel/circularr/) repository on GitHub.

- [Nodes](#nodes)
- [Circular](#circular-array)
- [Adding items](#adding-items)
- [Removing items](#removing-items)
- [Rotating the array](#rotating-the-array)
- [Array representation](#array-representation)
- [Example](#example)
- [Wrapping up](#wrapping-up)

## Nodes

Our circular array is implemented as a linked list for convenience and performance. That means we don’t maintain an actual array under the hood, just a bunch of “nodes” connected to one another. Like in your typical double-ended queue, every node has a previous and a next node.

```js
class Node {
  constructor(value) {
    this.value = value
    this.next = this.prev = null
  }

  remove() {
    this.prev.next = this.next
    this.next.prev = this.prev
  }
}
```

This `remove` method will come in handy later. It gives the capacity for a node to remove itself from the list by connecting its two neighbors (and thus removing all references to itself).

Note that nodes are completely transparent to our usage. This is solely an internal data wrapper. We never actually manipulate the nodes manually when using our circular array.

## Circular array

Our array relies on a “pointer.” When adding items to our array, we’ll insert them before our pointer. We also need to maintain the amount of items manually, since we don’t actually use an array.

Our class will look like this (we’ll break every function down in further sections):

```js
class CircularArray {
  size = 0
  pointer = null

  constructor(values = []) {}

  get length() {}

  push(value) {}
  unshift(value) {}

  pop() {}
  shift() {}

  rotate(offset) {}

  toArray() {}
}
```

## Adding items

Adding items to our circle means inserting a node to the left of (before) the pointer. For instance, consider a circle with number 1 to 9 and the pointer being on number 1, adding 10 would imply:

```
… 9 (1) 2 …    →    … 9 10 (1) 2 …
```

The first thing we need to do in our `push` method is wrap our given value with a node, since anything in our list needs to be a node.

```js
push (value) {
  const node = new Node(value)

  // … see below
}
```

We also need to increment the size of our array.

```js
this.size++
```

If we don’t have a pointer yet (which happens when the list is empty), our node becomes the pointer. And because our array is a circular one, we mark the previous and next nodes of our only node as … itself. It’s kind of ouroboros, but the whole point is that our loop is always closed. The node is on both on the left and on the right of itself.

```js
if (!this.pointer) {
  node.next = node.prev = this.pointer = node
}
```

If we have a pointer though, we can deal with our main logic. We always want to insert items _before_ our pointer.

```js
else {
  node.next = this.pointer // Mark as left of pointer
  node.prev = this.pointer.prev // Mark as right of former last item
  node.prev.next = node // Update former last item’s right
  this.pointer.prev = node // Update pointer’s left
}
```

<details>
<summary>The whole <code>push</code> method</summary>

```js
push(value) {
  const node = new Node(value)

  this.size++

  if (!this.pointer) {
    node.next = node.prev = this.pointer = node
  } else {
    node.next = this.pointer
    node.prev = this.pointer.prev
    node.prev.next = node
    this.pointer.prev = node
  }

  return this
}
```

</details>

{% info %} To make the circular array instantiation a little more convenient, we can iterate over the values (or array) given to the constructor and push them one by one. {% endinfo %}

If we want to insert items at the “start” of our array, we can do the same exact same thing as we just did, and then move the pointer to the newly added item.

```js
unshift(value) {
  this.push(value)
  this.pointer = this.pointer.prev
}
```

So if we were to push number 10 at the start, it would look like this:

```
… 9 (1) 2 …    →    … 9 (10) 1 2 …
```

## Removing items

Popping items means removing the item to the left of the pointer (the “last” item). On a circle with numbers from 1 to 9, dropping 9 would mean:

```
… 8 9 (1) 2 …    →    … 8 (1) 2 …
```

Here is how our `pop` method would look like. First, we make sure there is an item in the list, otherwise we can return `undefined` (like `Array.prototype.pop` does).

```js
pop() {
  if (!this.pointer) return undefined

  // … see below
}
```

Then, we store the value of our last node (the one before the pointer) that we’ll return.

```js
const value = this.pointer.prev.value
```

We reduce our size by 1.

```js
this.size--
```

Then depending on whether we’re removing the only item or not, we do one of two things. If the array is being emptied, we just clear the pointer. Otherwise, we remove the node before the pointer.

```js
if (this.size === 0) {
  this.pointer = null
} else {
  this.pointer.prev.remove()
}
```

Finally, we return our value:

```js
return value
```

<details>
<summary>The whole <code>pop</code> method</summary>

```js
pop() {
  if (!this.pointer) return undefined

  const value = this.pointer.prev.value

  this.size--

  if (this.size === 0) {
    this.pointer = null
  } else {
    this.pointer.prev.remove()
  }

  return value
}
```

</details>

The `shift` method looks very similar so I’ll skip it for simplicity. An example would be:

```
… 9 (1) 2 3 …    →    … 9 (2) 3 …
```

## Rotating the array

What if we want to remove items that are not at the start or the end of the array? This is where rotation comes into play. Rotating our array means moving the pointer around so that when we add or remove items, we do that where we want.

```
Current state  |  Clockwise by 1  |  Couter-clockwise by 1
… 9 (1) 2 …    |  … 8 (9) 1 …     |  … 1 (2) 3 …
```

Our rotation function takes an “offset”, which is the number of times we want to move the pointer. If it’s positive, we rotate the circle clockwise (so we move the pointer to the left). If it’s negative, we rotate the circle counter-clockwise (so we move the pointer to the right).

To avoid doing more rotations than we need to, we initially modulo the offset by the size. This way, if we try rotating a circle of 10 items 101 times, we end up rotating it once only.

```js
rotate(offset) {
  offset %= this.size

  if (offset > 0) while (offset--) this.pointer = this.pointer.prev
  else while (offset++) this.pointer = this.pointer.next

  return this
}
```

## Array representation

Our circular array wouldn’t be as useful if we didn’t have a way to output it as a regular array. What it means for us is to disconnect our circle before the pointer, and stretch it as a line. Depending on whether we want to unroll our circle clockwise or counter-clockwise, we can pass a different argument.

```js
toArray(direction = 'next') {
  const items = []

  if (!this.size) return items

  let node = this.pointer

  do {
    items.push(node.value)
    node = node[direction]
  } while (!Object.is(node, this.pointer))

  return items
}
```

{% info %} Note that our `prev` parameter is not the same as using `.reverse()`. In our case, the pointer is _always_ the first item, and then we enroll clockwise or counter-clockwise. {% endinfo %}

## Examples

A perfect example of when a circular array is handy is for the [Josephus problem](https://en.wikipedia.org/wiki/Josephus_problem).

To put it simply: counting begins at a specified point in the circle and proceeds around the circle in a specified direction (typically clockwise). After a specified number of items are skipped, the next item is removed. The procedure is repeated with the remaining items, starting with the next one, going in the same direction and skipping the same number of items, until only one item remains.

Considering we would skip one item out of 2, this is how it would be implemented. At every iteration, we rotate the circle clockwise by 1 and drop the first one, until we have only one item remaining.

```js
const circle = new CircularArray([1, 2, 3, 4, 5, 6, 7, 8, 9])

while (circle.length > 1) circle.rotate(-1).shift()

console.log('Remaining item is', circle.pop()) // 3
```

## Wrapping up

That’s about it! It might not be much, but it was a lot of fun for me to learn about linked lists and try my hands on one. The [code on GitHub](https://github.com/KittyGiraudel/circularr/) contains a few more features that we haven’t covered today like a `length` setting to truncate the array.

I hope you liked it!
