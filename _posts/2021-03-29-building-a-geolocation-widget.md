---
title: Building a geolocation widget
---

Gorillas being about delivering groceries, we recently released a small geolocation widget on the [homepage of our website](https://web.archive.org/web/20210310065642/https://gorillas.io/en). We’re growing fast, but there are still some areas do not serve, so we wanted to make it easily accessible for people to know whether they could use our services.

If I’m being honest, it wasn’t such a trivial piece of interface, so I want to go through how we built it — hopefully it helps others to make their geolocation widget clean and accessible.

<video preload="none" playsinline="" controls aria-label="Button on Gorillas website stating “Do you deliver to my area?” Once clicking, it changes to “Please wait…” for a few seconds before stating “Yay! We deliver to your area.” under a round of confetti!" disablepictureinpicture="" poster="https://pbs.twimg.com/tweet_video_thumb/Ew2DNIPWQAIDa8_.jpg" src="https://video.twimg.com/tweet_video/Ew2DNIPWQAIDa8_.mp4" type="video/mp4" style="margin: auto; display: block;"></video>

## What does it do?

In principle, this is not too complex. When interacting with the unique button, we:

1. Ask for permission to retrieve the user’s geoposition via the [geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).
2. Send these coordinates to our backend API which returns whether we can deliver to that area or not.
3. Display the outcome on screen, while making sure it is accessible to assistive technologies.

While that sounds relatively straightforward, there are _a lot_ of things that can go wrong here:

- JavaScript could be unavailable or disabled.
- We could be missing the permission to read the user’s geoposition, or we could be declined to do so.
- The geolocation API and/or the [permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) could not be supported by the browser.
- The geolocation request and the backend request could fail for various reasons.

So we need to think about all this while building our little widget.

## Core component

Because there are a lot of things to consider, the code is going to be large and complex. We wanted to make sure things remain approachable, especially if we have to maintain it further down the line. To do so, we extracted the geolocation logic into a hook (`useGeolocation`), and every single state into its own visual component.

```jsx
const GeoCheck = () => {
  const isMounted = useIsMounted()
  const [isPristine, setIsPristine] = React.useState(true)
  const { permission, isEligible, hasErrored } = useGeolocation(isPristine)

  if (!isMounted) return null
  if (isPristine) return <GeoCheck.Pristine setIsPristine={setIsPristine} />
  if (hasErrored) return <GeoCheck.Error />
  if (isEligible) return <GeoCheck.Success />
  if (isEligible === false) return <GeoCheck.Sad />
  if (permission === 'denied') return <GeoCheck.Denied />

  return <GeoCheck.Waiting permission={permission} />
}
```

Let’s break down what the component does in order:

1. If JavaScript is not available, render nothing. This means this component only renders once JavaScript is available, loaded and executed. It will not render on the server, which is good because it _cannot_ work without JavaScript.
2. We have a concept of “pristine”, which means whether or not the component has been interacted with. Basically all the button will do is turn the `isPristine` boolean to `false`, and the `useGeolocation` hook will react to this state change.
3. If there was an error at some point, either with the geolocation or with the eligibility request, return an erroring state.
4. If we managed to retrieve the user’s geoposition and contact the backend and get a successful response, yay! Party time, bring on the confetti! 🎉
5. If we managed to retrieve the user’s geoposition but the backend unfortunately returns that we do not deliver there, render the sad state.
6. If the permission to access geolocation was denied, explicitly mention it so the user can fix the problem (or ignore it if they want so).
7. Finally, any other state is considered a waiting state. Whether it’s because we are waiting for the user to grant permissions, or for the browser to retrieve the geoposition, or for the backend to return an answer… Any such state is a waiting state.

## Markup

There is not a whole lot going on in HTML, but still a few things worth pointing out. When clicking the button, it gets replaced with the loading state. For that reason, we need to move the focus to the container (hence the negative `tabindex`), otherwise the focus gets lost entirely and a keyboard user will have to tab all the way to the widget.

```html
<div tabindex="-1">
  <p>Please wait, we are checking if we can deliver to you.</p>
</div>
```

~~We also mark the widget as loading via `aria-busy` during waiting times. When supported, this can lead to assistive technologies waiting for `aria-busy` being false to vocalize the new content.~~ In his [multi-function button](https://adrianroselli.com/2021/01/multi-function-button.html) article, Adrian Roselli explains how setting `aria-busy` removes the element from the accessibility tree, therefore losing focus, so this is a bad idea.

## The geolocation part

The geolocation part was definitely the most tricky thing to do properly. We need our `useGeolocation` hook to return 3 things:

1. Whether the user is eligible for delivery, if we managed to get an answer.
2. The browser permission for geolocation, so we can handle the case where it’s denied.
3. The error, if any. Actually just whether it errored at all is enough.

Our hook accepts the `isPristine` state from earlier, which is `true` if the button has not been interacted with. When that state changes to `false`, the hook starts doing its magic.

```js
export const useGeolocation = isPristine => {
  const [permission, setPermission] = useGeolocationPermission()
  const [hasErrored, setHasErrored] = React.useState(false)
  const [isEligible, setIsEligible] = React.useState(null)

  React.useEffect(() => {
    // Do the magic
  }, [isPristine])

  return { permission, hasErrored, isEligible }
}
```

It might be that we already have permission for the geolocation API, and that’s something we can check silently via the permission API. To avoid bloating our hook with more logic, we extracted the permission state into its own hook (`useGeolocationPermission`).

If the permissions API is supported, we ask for the state of the geolocation permission, and store the result in our state. We also listen for any change on that permission to synchronize our state. If the permissions API is not supported however, then we have to assume we need to ask for the geolocation permission.

```js
const useGeolocationPermission = () => {
  const [permission, setPermission] = React.useState()

  React.useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setPermission(result.state)
        result.onchange = () => setPermission(result.state)
      })
    } else setPermission('prompt')
  }, [])

  return [permission, setPermission]
}
```

The last piece of the puzzle is, well, the entire series of events in our main `useEffect`. Let’s have a look at it first, then break it down to understand it better.

```js
export const useGeolocation = isPristine => {
  const [permission, setPermission] = useGeolocationPermission()
  const [hasErrored, setHasErrored] = React.useState(false)
  const [isEligible, setIsEligible] = React.useState(null)

  React.useEffect(() => {
    if (isPristine || permission === 'denied') return

    getCoords()
      .then(coords => {
        setPermission('granted')
        return coords
      })
      .then(getEligibility)
      .then(setIsEligible)
      .catch(error => {
        if (error.code === 1) setPermission('denied')
        else setHasErrored(true)
      })
  }, [isPristine, permission, setPermission])

  return { permission, hasErrored, isEligible }
}
```

Alright, so we ask for permission if the button has been interacted with (as in _not_ pristine) and we know the permission is not right off denied. From there, we are going to do a few things:

1. Request the geo-coordinates via the geolocation API (with the `getCoords` function, shared below).
2. If accessing the coordinates through the geolocation succeeded, explicitly set the permission to `granted`. This is for browsers that do not support the permissions API but do support geolocation, such as Safari.
3. Send the coordinates to the backend API (via the `getEligibility` function shared below) and expect a boolean result.
4. Store the result from the backend in the state to refresh the view.
5. If anything failed (either the geolocation API request, or the backend request), handle the error. If the error has a `code` property set to `1`, it means it’s a [permission error from the geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError/code), and we should update our permission state to reflect it. Otherwise, it’s most likely a HTTP or uncaught error, and we turn on our error state.

Let’s have a look at our two utilities. First `getCoords`, which is a thin wrapper around the geolocation API in order to “promisify” it. We also pass our options to it:

- A timeout, to make sure we’re not hogging the device’s hardware for a while with a request that’s pending.
- High accuracy, because our ability to deliver to someone can vary from a street to the next.
- A short cache for a few minutes to avoid using the geolocation chip when we just did already.

```js
export const getCoords = () =>
  new Promise((resolve, reject) => {
    const getCoords = response => resolve(response.coords)
    const options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 1000 * 60 * 5,
    }

    navigator.geolocation.getCurrentPosition(getCoords, reject, options)
  })
```

Finally, our `getEligibility` function does barely more than an HTTP request to our API:

```js
export async function getEligibility({ latitude, longitude }) {
  const query = `?lat=${latitude}&lng=${longitude}`
  const response = await window.fetch(`/api/delivery_areas${query}`)
  const data = await response.json()

  return data?.served ?? false
}
```

## Wrapping up

That was quite a ride, but we’re pretty pleased with the result. It looks really nice, it works well (at least as far as we can tell 😅) and it helps our visitors figuring out whether they can benefit from our lightning fast groceries delivery!
