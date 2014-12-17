A small library for generating a tree of objects representing routes,
as well as file paths.

Can be used to reduce a lot of require boilerplate when you create
and app with a consistent route -> directory mapping. Provides some options
for times when the structure isn't so well mapped :).

Needs something like Webpack that can handle dynamic requires.

### Todo
 - Document it a bit better
 - Add tests
 - Possibly remove `routes` just use `route`

### Example
With react-router and webpack:

```jsx
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

Corresponing file tree, notice how `dir` affects nesting:

```text
/components
  /kitchen
    Controls.jsx
    Modals.jsx
    Popovers.jsx
  Kitchen.jsx
  App.jsx
```