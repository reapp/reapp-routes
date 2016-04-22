var React = require('react');
var { route, routes } = require('../index');
var { Route, DefaultRoute } = require('react-router');

// this generator ties together react-router with reapp-routes

// reapp-routes has two main functions, routes and route.
// routes takes a route() tree and builds it recursively with a generator
// here our generator maps our route tree to react-router routes.

function generator(route, requirer) {
  console.log('/react-router.generator(route, requirer)');
  if (!route.component) {
    route.component = requirer(route.handlerPath);
  }

  if (route.default) {
    return <DefaultRoute {...route} />;
  }
  return (
    <Route path={route.path} component={route.component}>
      {route.children}
    </Route>
  );

}

module.exports = {
  route,

  // we are just currying the first argument
  // of routes to be this generator
  routes: routes.bind(null, generator)
};
