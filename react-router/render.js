// uses react router to run an app, with two options (sync or async)

var React = require('react');
var Router = require('react-router');
var { Promise } = require('bluebird');

// look at statics key "fetchData" on the Handler component to get data
function fetchAllData(routes, params) {
  var promises = routes
    .filter(route => route.handler.fetchData)
    .reduce((promises, route) => {
      promises[route.name] = route.handler.fetchData(params);
      return promises;
    }, {});

  return Promise.props(promises);
}

function renderToDocument(Handler, data) {
  return React.render(<Handler data={data} />, document.getElementById('app'));
}

function renderToString(Handler, data) {
  return React.renderToString(<Handler data={data} />);
}

module.exports = {
  // sync will fetch all data *before* returning
  // ideal for running from server
  sync(routes, opts, cb) {
    var render = opts.render || renderToString;
    var loc = opts.location || Router.HistoryLocation;

    Router.run(routes, loc, (Handler, state) => {
      fetchAllData(state.routes, state.params).then(data => {
        var out = render(Handler, data);

        if (cb)
          cb(out, data);
      });
    });
  },

  // async will render *first* without data, then fetch data and re-render
  // ideal for running from the client
  async(routes, opts, cb) {
    var render = opts.render || renderToDocument;
    var loc = typeof opts.location === 'undefined' ?
      Router.HistoryLocation :
      opts.location;

    // cordova shouldn't use HistoryLocation
    if (process.env.PLATFORM === 'ios')
      loc = null;

    Router.run(routes, loc, (Handler, state) => {
      render(Handler, state);
      fetchAllData(state.routes, state.params).then(data => {
        // only re-render if we fetched data
        if (Object.keys(data).length) {
          var out = render(Handler, data);

          if (cb)
            cb(out, data);
        }
      });
    });
  }
};