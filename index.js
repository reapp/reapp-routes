var defined = x => typeof x !== 'undefined';
var capitalize = s => s[0].toUpperCase() + s.slice(1);
var proper = name => name.split('-').map(capitalize).join('');
var pick = (a, b) => typeof a !== 'undefined' ? a : b;

function route(name, ...children) {
  var path, props, isRoute = true;

  if (!children)
    return { name, isRoute };

  if (children[0].isRoute)
    return { name, children, isRoute };

  if (typeof children[0] === 'string')
    path = children.shift();

  if (!children[0].isRoute)
    props = children.shift();

  if (!children.length)
    children = null;

  return Object.assign({ name, path, children, isRoute }, props);
}

var _requirer, _generator;
function routes(generator, opts, requirer, route) {
  // opts is optional, shift if necessary
  if (!route) {
    route = requirer;
    requirer = opts;
    opts = { dir: 'components' };
  }

  _requirer = requirer;
  _generator = generator;

  // we go through from top to bottom, to set the
  // parent path for the require's
  var routeTree = makeTree(route, defined(opts.dir) ? opts.dir + '/' : '');

  // then we go again from bottom to top to require
  return makeRoutes(routeTree);
}

// once you've made your tree of routes, you'll want to do something
// with them. This is a helper to recurse and call your generator
function makeRoutes(route) {
  route.children = route.children ? route.children.map(makeRoutes) : null;
  return _generator(route, _requirer);
}

// makes the tree of routes, but adds a handlerPath prop
// handlerPath is determined by parents dir attr, or name,
// and is used later to require components
function makeTree(route, parentsPath) {
  var children;

  if (route.children)
    children = route.children.map(child => {
      return makeTree(child, parentsPath + pick(route.dir, route.name) + '/');
    });

  return {
    name: route.name,
    path: route.path,
    handlerPath: './' + parentsPath + proper(route.name),
    children
  };
}

module.exports = { route, routes };