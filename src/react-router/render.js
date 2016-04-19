// uses react router to run an app, with two options (sync or async)
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

// look at statics key "fetchData" on the Handler component to get data
function fetchAllData(routes, params) {
  var promises = routes
    .filter(route => route.handler.fetchData)
    .reduce((promises, route) => {
      promises[route.name] = route.handler.fetchData(params);
      return promises;
    }, {});

  if (!Object.keys(promises).length)
    return Promise.resolve({});

  const resolveAllOnObject = Promise.props || Promise.all || function() {};
  return resolveAllOnObject(promises);
}

function renderToDocument(Handler, props, context) {
  return ReactDOM.render(
    <Handler {...props} />,
    document.getElementById('app')
  );
}

function renderToString(Handler, data) {
  return React.renderToString(<Handler data={data} />);
}

module.exports = {
  // sync will fetch all data *before* returning
  // ideal for running from server
  sync(routes, opts, cb) {
    opts = opts || {};
    var render = opts.render || renderToString;
    var loc = opts.location || Router.HistoryLocation;

    Router.run(routes, loc, (Handler, state) => {
      fetchAllData(state.routes, state.params).then(data => {
        var out = render(Handler, { data }, opts.context);

        if (cb)
          cb(out, data);
      });
    });
  },

  // async will render *first* without data, then fetch data and re-render
  // ideal for running from the client
  async(routes, opts, cb) {
    opts = opts || {};
    var render = opts.render || renderToDocument;
    var loc = typeof opts.location === 'undefined' ?
      Router.HistoryLocation :
      opts.location;

    // cordova shouldn't use HistoryLocation
    if (process.env.PLATFORM === 'ios' || process.env.PLATFORM === 'android')
      loc = null;

    ReactDOM.render(<Router history={browserHistory} routes={routes} />, document.getElementById('app'));

    /*
    Router.run(routes, loc, (Handler, state) => {
      render(Handler, { state }, opts.context);
      fetchAllData(state.routes, state.params).then(data => {
        // only re-render if we fetched data
        if (Object.keys(data).length) {
          var out = render(Handler, { data }, opts.context);

          if (cb)
            cb(out, data);
        }
      });
    });
    */
  }
};
