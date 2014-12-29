var React = require('react');
var { route, routes } = require('../index');
var { Route, DefaultRoute } = require('react-router');

function generator(route, requirer) {
  route.handler = requirer(route.handlerPath);

  return route.default ?
    <DefaultRoute {...route} /> :
    <Route {...route} />;
}

module.exports = {
  route,
  routes: routes.bind(null, generator)
};