---
title: "Cleaning the social buttons... again"
layout: post
preview: true
comments: false
---
<section>
Because sometimes we still have to. At work, we have been asked to add a couple of social links to share our content across all those fancy social media. Of course you know what I mean, you all know this shit too well, don't you?

Facebook, Twitter and all their little brothers provide a neat "Get code" thingie to inject those buttons on your site in less than 5 minutes. It does the work so how bad could it be? Well, pretty bad.
</section>
<section id="whats-wrong">
## What's wrong with all-made social buttons? [#](#whats-wrong)

They are heavy like hell. I knew they were but I wanted to see it for myself thus I started by doing it with Facebook's tool. **3 fucking iframes**. For a simple link with a counter. 3 injected documents into the DOM. For a button. Think about it. 

<blockquote class="pull-quote--right">Social buttons are extremely heavy.</blockquote>

Funny thing, I came across [this article](http://www.sitepoint.com/social-sharing-hidden-costs/) by Craig Buckler at SitePoint the same day. According to Craig's tests, Facebook "like" button is about 270Kb. Compressed. 

It was a deal breaker: no way we would support this kind of crap. So we started looking to find other solutions.
</section>
<section id="good-old-fashion-way">
## The good ol' fashion way [#](#good-old-fashion-way)

We have spent like half an hour searching for ideas to have social media buttons without iframes, and some implementations came pretty close. Anyway we found the solution: a home-made link directing to Facebook share page coupled with an AJAX request to get the number of shares. Quick and clean.

### Making the button

No magic here, just some HTML (via Twig) and CSS (via Sass). The button is a little more than just a link since we need a wrapper for the share counter. So a wrapping div, then a link and a span. The icon is added through a pseudo-element on the anchor tag to avoid using an extra span.

<pre class="language-markup"><code>{&#37; set currentUrl = "&#123;&#123; app.request.getSchemeAndHttpHost() ~ path(app.request.attributes.get('_route'), app.request.attributes.get('_route_params')) &#125;&#125;" &#37;}

&lt;div class="btn-facebook">
  &lt;a class="btn-facebook__link" href="http://www.facebook.com/sharer.php?u={{ currentUrl }}">Share&lt;/a>
  &lt;span class="btn-facebook__count">&lt;/span>
&lt;/div>

&lt;div class="btn-twitter">
  &lt;a class="btn-twitter__link" href="https://twitter.com/share" data-url="{{ currentUrl }}">Share&lt;/a>
  &lt;span class="btn-twitter__count">&lt;/span>
&lt;/div></code></pre>

Regarding SCSS, not much to tell either. A placeholder wrapping all the styles, a mixin extending the placeholder and one mixin call per button passing the accurate color.

<pre class="language-scss"><code>%social-button {
  @include inline-block(none);
  border: 1px solid;
  border-radius: .2em;
  margin: 0 .5em;

  > a,
  > span {
    @include inline-block(none);
    padding: .25em .5em;
  }

  > a {
    color: white;

    &:hover {
      text-decoration: none;
    }
  }

  > span {
    background: white;
    color: #454545;
    border-radius: 0 .2em .2em 0;

    &:empty {
      display: none;
    }
  }
}

@mixin social-button($color, $icon: null) {
  @extend %social-button;
  background: $color;
  border-color: $color;

  &:hover {
    background: lighten($color, 10%);
  }

  @if $icon != null {
    > a:before {
      content: quote($icon);
      margin-right: .25em;
    }
  }
}

.btn-twitter {
  @include social-button(#0088cc, '\e603'); 
}

.btn-facebook {
  @include social-button(#4c66a4, '\e610'); 
}</code></pre>

<blockquote class="pull-quote--right">Hope for the best, prepare for the worst.</blockquote>

One interesting thing to note here: the `:empty` rule. Basically it makes the span counter disappear if it's empty which happens before the AJAX request is made and if the AJAX request ever crashes. Shouldn't but could and you know the saying: *hope for the best, prepare for the worst*.

### Requesting the counter

For the JS part, I created a litteral object for a matter of simplicity. All I have to do to make both requests (Twitter and Facebook) is call the `init` function from the object with the current page URL as the only parameter.

<pre class="language-javascript"><code>var Social = {
  settings: {
    url: null,
    twitter: {
      counterNode: $('.btn-twitter__count'),
      requestUrl: 'http://urls.api.twitter.com/1/urls/count.json?url='
    },
    facebook: {
      counterNode: $('.btn-facebook__count'),
      requestUrl: 'http://graph.facebook.com/'
    }
  },
  
  facebook: function () {
    if (this.settings.url !== null && this.settings.facebook.counterNode.length) {
      $.get(this.settings.facebook.requestUrl + this.settings.url, function (response) {
        if (typeof response !== 'undefined') {
          Social.settings.facebook.counterNode.html('shares' in response ? response.shares : 0);
        }
      });
    }
  },

  twitter: function () {
    if (this.settings.url !== null && this.settings.twitter.counterNode.length) {
      $.get(this.settings.twitter.requestUrl + this.settings.url, function (response) {
        if (typeof response !== 'undefined') {
          Social.settings.twitter.counterNode.html(response.count);
        }
      });
    }
  },

  init: function (url) {
    if (typeof url !== 'undefined') {
      this.settings.url = url;
      this.twitter();
      this.facebook();
    }
  }
};</code></pre>

The code is pretty straight forward. Each of the two main methods (`twitter()` and `facebook()`) make an AJAX request on their respective API with the given URL to retreive the number of likes / shares. Then the result is injected into the DOM at the right spot.

What's cool is that the buttons are working like a charm even if JavaScript is disabled / broken. The JavaScript `Social` object is only here to enhance the buttons by adding counters. 

Making the buttons display counters couldn't get any easier:

<pre class="language-markup"><code>Social.init("&#123;&#123; app.request.getSchemeAndHttpHost() ~ path(app.request.attributes.get('_route'), app.request.attributes.get('_route_params')) &#125;&#125;")</code></pre>

Yeah... The Twig code to get the current URL isn't the prettiest code ever. You might want to create a little Twig extension like `get_current_url` doing this for you. But that's really not the point.
</section>
<section id="final-thoughts">
## Final thoughts [#](#final-thoughts)

At the end of the day, we managed to have social sharing buttons that:

* do the same thing as the all-made ones
* are fully customizable through CSS
* don't output a shitload of stuff into the DOM
* are enhanced by JavaScript, not dependant of it

Isn't that nice when things just work?
</section>