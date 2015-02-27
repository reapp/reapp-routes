var React = require('react');
var { route, routes, notFoundRoute, defaultRoute } = require('../index');
var { NotFoundRoute, Route, DefaultRoute } = require('react-router');

// this generator ties together react-router with reapp-routes

// reapp-routes has two main functions, routes and route.
// routes takes a route() tree and builds it recursively with a generator
// here our generator maps our route tree to react-router routes.

function generator(route, requirer) {
  route.handler = requirer(route.handlerPath);

  switch (route.type) {
    case defaultRoute:
      return <DefaultRoute {...route} />;
    case notFoundRoute:
      return <NotFoundRoute {...route} />;
    default:
      if (route.type) {
        console.warn('Warning: Invalid route type passed, creating standard <Route />');
      }
      return <Route {...route} />;
  }
}

module.exports = {
  route,

  // we are just currying the first argument
  // of routes to be this generator
  routes: routes.bind(null, generator)
};
