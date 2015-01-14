var generator = require('./generator');
var render = require('./render');
var Env = require('reapp-platform/src/Env');

module.exports = {
  run(routes) {
    var generatedRoutes = routes(generator);

    if (Env.CLIENT)
      render.async(generatedRoutes);
    else
      render.sync(generatedRoutes);
  }
};