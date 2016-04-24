require('reapp-object-assign');
import { createRoutes } from 'react-router';

// reapp-routes is two helper functions that help your manage routes

// Why? To have a generic way of defining routes that you could then
// tie to a custom generator. This allows two things:

// 1. It's a DSL: don't tie your route's to one specific implementation.
//      routes() event takes a generator so you can tie into route generation.

// 2. It allows dynamic manipulation:
//      route() just returns an object tree, much like React components

var defined = x => typeof x !== 'undefined';
var pick = (a, b) => typeof a !== 'undefined' ? a : b;

// todo: allow people to choose their naming scheme
var capitalize = s => s[0].toUpperCase() + s.slice(1);
var proper = name => name.split('-').map(capitalize).join('');

// route is just an object with keys
// name: string, path: string, isRoute: bool, children: array
function route(name, ...children) {
  var path, props, isRoute = true;

  if (!children || !children.length) {
    return { name, isRoute };
  }

  if (children[0].isRoute) {
    return { name, children, isRoute };
  }

  if (typeof children[0] === 'string') {
    path = children.shift();
  }

  if (children[0] && !children[0].isRoute) {
    props = children.shift();
  }

  if (!children.length) {
    children = null;
  }

  return Object.assign({ name, path, children, isRoute }, props);
}

var _requirer, _generator;

/**
 * Recurse over route tree and apply a generator.
 * @param {func} generator - function to be run and passed route on creation
 * @param {obj} opts - extra properties to be added to a route
 * @param {func} requirer - helper for a common use case, passing in require func
 * @param {obj} route - the tree of routes you are generating
 */
function routes(generator, opts, requirer, route) {
  // todo: having this tied to dir creation is bad coupling
  // opts is optional, shift if necessary
  if (!route) {
    route = requirer;
    requirer = opts;
    opts = { dir: 'components' };

    // requirer optional :/
    if (!route) {
      route = requirer;
      requirer = null;
    }
  }

  _requirer = requirer;
  _generator = generator;

  // we go through from top to bottom, to set the
  // parent path for the require's
  var routeTree = makeTree(route, defined(opts.dir) ? opts.dir + '/' : '');

  // then we go again from bottom to top to require
  routeTree = makeRoutes(routeTree, _requirer);

  // translate routes
  //routeTree = translateRoutes(routeTree);

  //console.log('translated routes to createRoutes');
  //console.log(createRoutes(routeTree));

  return routeTree;


}

// once you have your generated routes, translate route to react-router 2.0.0 style
// props with component references
// the result of this function (from routes function above) goes to react-router/render.async(routes, opts, cb)
function translateRoutes(route) {
  let newRoute = {}
  newRoute.path = route.path;
  newRoute.component = route.component
  if (route.children) {
    newRoute.childRoutes = route.children.map((childItem) => {
      return translateRoutes(childItem);
    });
  } else {
    newRoute.childRoutes = null;
  }
  return newRoute;
}

// once you've made your tree of routes, you'll want to do something
// with them. This is a helper to recurse and call your generator
function makeRoutes(route, requirer) {
  let newRoute = {}
  newRoute.path = route.path || `/${route.name}`;
  newRoute.handlerPath = route.handlerPath;

  if (route.children) {
    newRoute.children = route.children.map((childItem) => {
      return makeRoutes(childItem, requirer);
    });
  } else {
    newRoute.children = null
  }

  return _generator(newRoute, requirer);

}

// makes the tree of routes, but adds a handlerPath prop
// handlerPath is determined by parents dir attr, or name,
// and is used later to require components
function makeTree(route, parentsPath) {
  var children;
  if (route.children) {
    children = route.children.map(child => {
      var childSubDir = pick(route.dir, route.name);
      var childParentsPath = parentsPath + (childSubDir ? childSubDir + '/' : '');
      return makeTree(child, childParentsPath);
    });
  }

  var handlerPath = './' + parentsPath + proper(route.name);

  return {
    ...route,
    handlerPath,
    children
  };
}

module.exports = { route, routes };
