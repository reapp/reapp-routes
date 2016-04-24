var React = require('react');
var { route, routes } = require('../index');
var { Route, IndexRoute } = require('react-router');

// this generator ties together react-router with reapp-routes

// reapp-routes has two main functions, routes and route.
// routes takes a route() tree and builds it recursively with a generator
// here our generator maps our route tree to react-router routes.

function generator(route, requirer, parentRoute) {

  console.log('generator route and ParentRoute');
  console.log(route);
  console.log(parentRoute);

  if (!route.component) {
    route.component = requirer(route.handlerPath);
  } else {
    route.component = null
  }



  if (route.children && route.children[0] && route.children[0].props.path === '/' && route.path === '/') {
    route.indexRoute = {
      component: route.children[0].props.component
    };
  }

  return (
    <Route {...route} />
  );
}

module.exports = {
  route,
  // we are just currying the first argument
  // of routes to be this generator
  routes: routes.bind(null, generator)
};
