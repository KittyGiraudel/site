---
title: Rate-limit Next.js API routes
---

Next.js provides a way to define [API routes](https://nextjs.org/docs/api-routes/introduction), which are essentially backend endpoints to run Node.js code. This is super neat to do server-side operations without having to maintain a full-blown server. Salma Alam-Naylor has [a good piece on serverless functions](https://whitep4nth3r.com/blog/what-is-the-edge-serverless-functions/).

Depending on what happens in these functions, it might be worth considering setting up some rate-limiting so they do not get abused. The idea is that as someone is issuing more and more requests, the responses get slower until they eventually stop and return [HTTP 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429).

This is how we would use it:

```js
export async function handler(request, response) {
  try {
    await applyRateLimit(request, response)
  } catch {
    return response.status(429).send('Too many requests')
  }

  // Rest of the API route code.
}
```

I personally like [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) and [express-slow-down](https://www.npmjs.com/package/express-slow-down). Unfortunately, they’re Express middlewares, and Next.js isn’t making it too trivial to use Express/Connect middlewares in API routes. The [Next.js documentation](https://nextjs.org/docs/api-routes/api-middlewares) recommends (a flavor of) the following function to convert them:

```js
const applyMiddleware = middleware => (request, response) =>
  new Promise((resolve, reject) => {
    middleware(request, response, result =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  })
```

Then, our `applyRateLimit` function. It takes 2 middlewares (more on that in a second), runs them through the `applyMiddleware` function to make them consumable outside of Express/Connect and then await them with the request and response. If a middleware rejects, `applyRateLimit` rejects as well. If they all resolve, `applyRateLimit` resolves successfully.

```js
async function applyRateLimit(request, response) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      .map(middleware => middleware(request, response))
  )
}
```

Now, our `middlewares` constant is an array made of our two middlewares: the one that causes slowness, and the one that eventually causes HTTP 429. The configuration values can (should) be tweaked based on the intended severity of the rate limit.

```js
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const getIP = request =>
  request.ip ||
  request.headers['x-forwarded-for'] ||
  request.headers['x-real-ip'] ||
  request.connection.remoteAddress

const limit = 10
const windowMs = 60 * 1_000
const delayAfter = Math.round(limit / 2)
const delayMs = 500

const middlewares = [
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
]
```

Here, it says one can do 10 requests within a 60 seconds window before being blocked, and responses start being slowed down (by an additional 500ms each) after the 5th request within the window. In practice, it looks like this:

1. HTTP 200 with no delay
2. HTTP 200 with no delay
3. HTTP 200 with no delay
4. HTTP 200 with no delay
5. HTTP 200 with no delay
6. HTTP 200 after a 0.5s delay
7. HTTP 200 after a 1.5s delay
8. HTTP 200 after a 2.0s delay
9. HTTP 200 after a 2.5s delay
10. HTTP 200 after a 3.0s delay
11. HTTP 429 Too Many Requests

If we want to customize the configuration per API route, we can refactor our code to be wrapped in a function:

```js
export const getRateLimitMiddlewares = ({
  limit = 10,
  windowMs = 60 * 1000,
  delayAfter = Math.round(10 / 2),
  delayMs = 500,
} = {}) => [
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
]
```

And then we would use it like this:

```js
const middlewares = getRateLimitMiddlewares({ limit: 50 }).map(applyMiddleware)

export default async function handler(request, response) {
  try {
    await Promise.all(
      middlewares.map(middleware => middleware(request, response))
    )
  } catch {
    return response.status(429).send('Too Many Requests')
  }

  // Rest of the API route code.
}
```

Note that is **very important** that the middlewares are defined _outside_ of the API route handler, otherwise every incoming request creates a fresh new set of middlewares, which means the rate limit will never work.

<details>
<summary>Get the whole code</summary>

```js
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const applyMiddleware = middleware => (request, response) =>
  new Promise((resolve, reject) => {
    middleware(request, response, result =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  })

const getIP = request =>
  request.ip ||
  request.headers['x-forwarded-for'] ||
  request.headers['x-real-ip'] ||
  request.connection.remoteAddress

export const getRateLimitMiddlewares = ({
  limit = 10,
  windowMs = 60 * 1000,
  delayAfter = Math.round(10 / 2),
  delayMs = 500,
} = {}) => [
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
]

const middlewares = getRateLimitMiddlewares()

async function applyRateLimit(request, response) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      .map(middleware => middleware(request, response))
  )
}

export default applyRateLimit
```

</details>

I hope this helps you secure your Next.js applications! ✨
