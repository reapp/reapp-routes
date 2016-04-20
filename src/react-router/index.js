var generator = require('./generator');
var render = require('./render');
var Env = require('reapp-platform/src/Env');

function run(routes, opts, cb) {

  // commenting out/resetting route generation since (testing) sending in an already-generated <Router> object
  // var generatedRoutes = routes(generator);
  const generatedRoutes = routes;

  opts = opts || {};

  if (Env.CLIENT) {
    render.async(generatedRoutes, opts, cb);
  } else {
    return function(opts, cb) {
      render.sync(generatedRoutes, opts, cb);
    };
  }

}

// add mixins
run.ParentRouteMixin = require('./ParentRouteMixin');
run.RoutedViewListMixin = require('./RoutedViewListMixin');

module.exports = run;
