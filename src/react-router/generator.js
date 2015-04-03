var React = require('react');
var { route, routes } = require('../index');
var { Route, DefaultRoute } = require('react-router');

// this generator ties together react-router with reapp-routes

// reapp-routes has two main functions, routes and route.
// routes takes a route() tree and builds it recursively with a generator
// here our generator maps our route tree to react-router routes.

function generator(route, requirer) {
  if (!route.handler)
    route.handler = requirer(route.handlerPath);

  return route.default ?
    <DefaultRoute {...route} /> :
    <Route {...route} />;
}

module.exports = {
  route,

  // we are just currying the first argument
  // of routes to be this generator
  routes: routes.bind(null, generator)
};