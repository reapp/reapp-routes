var generator = require('./generator');
var render = require('./render');
var Env = require('reapp-platform/src/Env');

function run(routes, opts, cb) {

  var generatedRoutes = routes(generator);

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
