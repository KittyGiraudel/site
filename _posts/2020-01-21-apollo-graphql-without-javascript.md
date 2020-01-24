---
title: Apollo GraphQL without JavaScript
tags:
  - JavaScript
  - GraphQL
  - Apollo
---

The N26 web platform is built on top of [GraphQL](https://www.apollographql.com/). Our Express server exposes a GraphQL API that proxies internal REST endpoints. This gives us a lot of flexibility and allows us to fill potential gaps while ensuring more consistency: we can rename fields and arguments, modify the response or even return data from several endpoints under a single operation.

As mentioned before, we [fully support the absence of JavaScript](/2020/01/18/n26-and-lack-of-javascript) (thanks to a carefully creafted server-side rendering solution). This brings an interesting challenge: how to work with Apollo GraphQL when JavaScript is not available? That is what we’ll cover in that article.

- [Apollo in React](#apollo-in-react)
- [Back to basics: forms](#back-to-basics-forms)
- [Layering a custom GraphQL middleware](#layering-a-custom-graphql-middleware)
- [Error handling](#error-handling)
- [Going further](#going-further)

## Apollo in React

To work with Apollo in React, we use [`react-apollo`](https://github.com/apollographql/react-apollo). This driver provides `useQuery` and `useMutation` hooks which are very handy to communicate with our Apollo server through React components. A simple example might look like this:

```jsx
import { useMutation } from "react-apollo";

const MUTATION = "mutation removeEntry ($id: ID!) { removeEntry(id: $id) }";

const RemoveEntryButton = props => {
  const [removeEntry] = useMutation(MUTATION);
  const handleClick = () => removeEntry({ variables: { id: props.id } });

  return (
    <button type="button" onClick={handleClick}>
      Remove entry
    </button>
  );
};
```

When interacting with the button, the mutation is sent to the Express server by firing an AJAX request (that’s what `useMutation` does) with everything necessary for `apollo-server-express` to handle it.

The problem is that when JavaScript is disabled or unavailable, the button ends up doing nothing. We could remove the button, but that means the feature altogether doesn’t work with JavaScript. No good!

## Back to basics: forms

Before the web became a wasteland of abandoned JavaScript frameworks, forms were all the hype to perform actions on web pages. So if we want to provide our features when JavaScript is not available, we need to render forms, fields, inputs and buttons. Our server needs to accept and treat these requests, then redirect back to the correct URL.

Originally, we used to duplicate our GraphQL logic into individual REST endpoints. So if we had a `removeEntry` mutation, we used to have a `/remove-entry` Express route just for no-JavaScript. Needless to say, that was not a scalable solution.

Instead, my amazing colleague [Mike Smart](https://twitter.com/smartmike) came up with an original solution: communicating with the GraphQL endpoint through HTML forms. We could keep things the way they are when JavaScript is enabled, and properly submit the form itself when JavaScript is not available. On the server, if it looks like it was coming from a form, we manually handle our request with Apollo.

Here is what our new `MutationForm` component looks like (with code comments for explanation):

```jsx
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import serialize from "form-serialize";

const MutationForm = props => {
  const [mutate] = useMutation(gql(props.mutation));
  const formRef = React.useRef();
  const handleSubmit = event => {
    // When submitting the form with JavaScript enabled, prevent the
    // default behaviour to avoid a page refresh.
    event.preventDefault();

    // Call the mutation with the serialised form for variables, then
    // redirect to the correct path accordingly.
    mutate({ variables: serialize(formRef.current, { hash: true }) })
      .then(() => window.history.pushState(null, null, props.successPath))
      .catch(() => window.history.pushState(null, null, props.failurePath));
  };

  // Render a <form> with a ref to be able to serialise it, and a
  // few hidden fields to hold the mutation and the redirect paths.
  return (
    <form action="/graphql" method="POST" ref={formRef} onSubmit={handleSubmit}>
      <input type="hidden" name="__mutation" value={props.mutation} />
      <input type="hidden" name="__successPath" value={props.successPath} />
      <input type="hidden" name="__failurePath" value={props.failurePath} />

      {
        // Mutation-specific fields, as well as the submit <button>
        // are up to the component to render.
        props.children
      }
    </form>
  );
};
```

Then we can rewrite our `RemoveEntryButton` as follow. Note how we now provide the `id` as a hidden input within our form, and how the button has `type="submit"`.

```jsx
const MUTATION = "mutation removeEntry ($id: ID!) { removeEntry(id: $id) }";

const RemoveEntryButton = props => (
  <MutationForm mutation={MUTATION} successPath="/" failurePath="/">
    <input type="hidden" name="id" value={props.id} />
    <button type="submit">Remove entry</button>
  </MutationForm>
);
```

## Layering a custom GraphQL middleware

A typical integration between Apollo and Express might look like this:

```js
const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer, makeExecutableSchema } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema");

const app = express();
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema, uploads: false });

app.use(bodyParser.urlencoded());
server.applyMiddleware({ app });

app.listen(8081, () => console.log(`🚀 Server ready at ${server.graphqlPath}`));
```

What we are going to need is a custom GraphQL middleware (`handleNoJavaScriptGraphQL`). We are going to insert it before setting up ApolloServer, so that if our middleware doesn’t need to do anything (when the request comes from `useMutation` with JavaScript), it can forward it to ApolloServer:

```js
app.use(bodyParser.urlencoded());
app.post("/graphql", bodyParser.json(), handleNoJavaScriptGraphQL(schema));
server.applyMiddleware({ app });
```

Our middleware should do a few things. First, it should detect whether the request comes from a client-side request, or the form submission (basically whether or not JavaScript was available).

If the request was performed with JavaScript, there is nothing more to do. `ApolloServer` will treat the request as always.

If the request comes from the form submission, it needs to call Apollo directly (with the undocumented but stable and exported [`runHttpQuery`](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-core/src/runHttpQuery.ts) function), passing it all the necessary information to perform the mutation. Then, depending on the result of the mutation, it will redirect to the success URL or to the failure one.

```js
const { runHttpQuery } = require("apollo-server-core");

const handleNoJavaScriptGraphQL = schema => (request, response, next) => {
  const {
    __mutation: query,
    __successPath: successPath,
    __failurePath: failurePath,
    ...variables
  } = request.body;

  // Pick the `MutationForm`’s hidden fields from the request body. If
  // they happen to be absent, return early and call `next`, as this
  // means the request was performed with JavaScript, and this
  // middleware has no purpose.
  if (!query || !successPath || !failurePath) {
    return next();
  }

  // Pass the schema, the mutation and the variables to Apollo manually
  // to execute the mutation.
  return runHttpQuery([request, response], {
    method: request.method,
    options: { schema },
    query: { query, variables }
  })
    .then(({ graphqlResponse }) => {
      const { data } = JSON.parse(graphqlResponse);
      const operationName = Object.keys(data)[0];
      const url = !data[operationName] ? failurePath : successPath;

      // CAUTION: be sure to sanitise that URL to make sure
      // it doesn’t redirect to a malicious website.
      return response.redirect(url);
    })
    .catch(error => response.redirect(failurePath));
};
```

That’s it! We managed to issue and handle a mutation with Apollo without having JavaScript available in the browser. All we did was submitting all the necessary information for Apollo in a HTML form, and process it ourselves on the server.

## Error handling

It took us a bit of head-scratching to come up with a way to send potential errors back to the page. Originally, we prototyped passing them as part of the URL when redirecting back to the failure path. This was not ideal for several reasons, privacy and security being the most important ones.

We ended up serialising (and encrypting in our case, but this is not a required step) the outcome of the mutation and storing it in a cookie. Then, _after_ we redirect back to the failure path, we read that cookie on the server, and pass it in a React context, then delete the cookie. From there, the React tree can read the errors from the React context and render them.

## Going further

In this article, we cover only the very basics to make it possible to use Apollo without necessarily relying on client-side JavaScript. That being said, a lot can be done to go further that route. Here are a few suggestions.

⚙️ When client-side JavaScript is available and we do not go through a page render after a mutation, it might be handy to refetch some GraphQL queries. To do so, we can make the `MutationForm` accept an `options` prop that is passed to Apollo.

```diff
-mutate({ variables })
+mutate({ ...props.options, variables })
```

---

⏳ It is commonly advised to visually represent that an action is taking place through a loading state (when client-side JavaScript is present). We can modify our `handleSubmit` handler to save that state.

```js
const [isLoading, setIsLoading] = React.useState(false);
const handleSubmit = event => {
  event.preventDefault();
  setIsLoading(true);

  mutate({ variables: serialize(formRef.current, { hash: true }) })
    .then(() => window.history.pushState(null, null, props.successPath))
    .catch(() => window.history.pushState(null, null, props.failurePath))
    .finally(() => setIsLoading(false));
};
```

We can then pass that state to the React children by expecting a function instead of a React tree.

```js
props.children({ isLoading });
```

While let us re-author our `RemoveEntryButton` as such:

```jsx
<MutationForm>
  {({ isLoading }) => (
    <button type="submit" aria-disabled={isLoading}>
      {isLoading && <Loader />}
      {isLoading ? "Removing entry…" : "Remove entry"}
    </button>
  )}
</MutationForm>
```

---

This entire concept required some outside-the-box thinking, but it enabled us to keep offering a JavaScript-less experience in a scalable way. We get no-JS support basically out-of-the-box by simply using our `MutationForm` component. Totally worth it. ✨
