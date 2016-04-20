## reapp-routes

A small library for generating a tree representing routes that also map to paths.

This does two things: saves code and enforces consistency.

**Before reapp-routes**

```js
var App = require('./components/App');
var Sub = require('./components/app/Sub');
var OtherSub = require('./components/app/OtherSub');

module.exports =
  <Route handler={App} path="/">
    <Route name="sub" handler={Sub} />
    <Route name="otherSub" handler={OtherSub} />
  </Route>
```

**With reapp-routes**

```js
module.exports = routes(require,
  route('app',
    route('sub'),
    route('otherSub')
  )
)
```

The `routes` method reads in the object tree generated by `route` and determines
the path correspondingly. You can even customize it using the `dir` property on routes.
In the end, you end up with consistent directory structures that map to your routes,
less requires, less code and a simple routes file.

It does require Webpack or a bundle system that handles dynamic requires.

### Examples

Using react-router helpers:

```js
var { route, routes } = require('reapp-routes/react-router/generator');

module.exports = routes(require,
  route('app', '/', { dir: '' },
    route('kitchen', '/',
      route('controls'),
      route('modals'),
      route('popovers'),
      route('forms')
    ),
    route('viewer')
  )
);
```

Rolling your own:

```js
var React = require('react');
var { Route, DefaultRoute } = require('react-router');
var { route, routes } = require('react-router-generator');

module.exports = generate(routes(
  { dir: 'components/' },
  route({ name: 'app', path: '/', dir: '' },
    route('kitchen',
      route('controls'),
      route('modals'),
      route('popovers')
    )
  )
));

function generate(props) {
  props.children = props.children ? props.children.map(generate) : null;
  props.handler = require(props.handlerPath);

  return props.defaultRoute ?
    <DefaultRoute {...props} /> :
    <Route {...props} />;
}
```

Corresponding file tree. Notice how `dir` affects nesting:

```text
/components
  /kitchen
    Controls.jsx
    Modals.jsx
    Popovers.jsx
  Kitchen.jsx
  App.jsx
```

### Todo
 - Document, tests

See the index.js for more in-code documentation.
