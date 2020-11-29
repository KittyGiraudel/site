---
title: Casting a map into a list in Sass
keywords:
  - sass
  - lists
  - maps
---

I have this article ready for about 3 months now but I never found an occasion to release it… until today! This will be quite short but I still wanted to write a little something on the topic anyway. You might have read my [article about SassyCast](/2014/01/27/casting-types-in-sass/), a small Compass extension I wrote to convert data types in Sass.

SassyCast making possible to go from any data type to any data type (or almost), it includes a way to cast a map into a list. While the function I wrote was kind of straight forward, [Julien Cabanes showed me a cool little improvement to the function](https://twitter.com/JulienCabanes/status/427920448899538944) on Twitter. I merged his code in SassyCast 1.0.0.

## The old way

The `to-list` function core is pretty straightforward. If the given value is a map, we iterate over it to create a 2-dimensional list like this: `( "key-1" "value 1", "key-2" "value 20" )`.

```scss
@function to-list($value) {
  @if type-of($value) == 'map' {
    $keys: ();
    $values: ();

    @each $key, $val in $value {
      $keys: append($keys, $key);
      $values: append($values, $val);
    }

    @return zip($keys, $values);
  }

  @return if(type-of($value) != 'list', ($value,), $value);
}
```

To be a little more precise about what’s being done here: we loop through each map entry, store the key in a `$keys` list and the value in a `$values` list. Then we [zip](https://sass-lang.com/documentation/Sass/Script/Functions.html#zip-instance_method) both to return a 2-dimensional list where the first element of each list if the former key and the second element of each list is the former value.

Does the job well.

## The new way

Julien thought it would be cool to be able to keep only keys, or only values or both (what I’ve done) so he added an extra parameter to the function accepting either `keys` or `values` or `both`. Every other value would fallback to `both`.

Then depending on the flag, he returns either `$keys` or `$values` or a zip of both.

```scss
@function to-list($value, $keep: 'both') {
  $keep: if(index('keys' 'values', $keep), $keep, 'both');

  @if type-of($value) == 'map' {
    $keys: ();
    $values: ();

    @each $key, $val in $value {
      $keys: append($keys, $key);
      $values: append($values, $val);
    }

    @if $keep == 'keys' {
      @return $keys;
    } @else if $keep == 'values' {
      @return $values;
    } @else {
      @return zip($keys, $values);
    }
  }

  @return if(type-of($value) != 'list', ($value,), $value);
}
```

If you don’t like conditional return statements or if you simply want to look like a badass with an unreadable ternary mess, you could return something like this:

```scss
@return if($keep == 'keys', $keys, if($keep == 'values', $values, zip($keys, $values)));
```

Literally:

1. If `$keep` is `'keys'`, return `$keys`
2. Else if `$keep` is `'values'`, return `$values`
3. Else return `zip($keys, $values)`

## Final thoughts

Let’s try it with a little example, shall we? First, our map.

```scss
$breakpoints: (
  'small': 600px,
  'medium': 900px,
  'large': 1200px
);
```

And now, we cast it to a list.

```scss
$breakpoints-list: to-list($breakpoints, 'both');
// ('small' 600px, 'medium' 900px, 'large' 1200px)

$breakpoints-keys: to-list($breakpoints, 'keys');
// ('small' 'medium' 'large')

$breakpoints-values: to-list($breakpoints, 'values');
// (600px 900px 1200px)
```

That’s all folks! Thanks again Julien!
