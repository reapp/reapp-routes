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

function renderToDocument(Handler, props, context) {
  console.log(context);
  var ContextHandler = ChildContextProviderFactory(context);

  return React.render(
    <ContextHandler
      context={context}
      componentProvider={() => <Handler {...props} />}
    />,
    document.getElementById('app')
  );
}

function ChildContextProviderFactory(context) {
  var childContextTypes = {};
  Object.keys(context).forEach(contextKey => {
    childContextTypes[contextKey] = React.PropTypes.any.isRequired
  });

  console.log('child context types', childContextTypes, context)

  return React.createClass({
    displayName: 'ChildContextProvider',
    childContextTypes,
    propTypes: {
      componentProvider: React.PropTypes.func.isRequired,
      context: React.PropTypes.object.isRequired
    },
    getChildContext: function() {
      return this.props.context;
    },
    render: function() {
      // TODO simplify this "componentProvider hack" after React 0.14? See See https://github.com/facebook/react/issues/3392
      var children = this.props.componentProvider();
      return children;
    }
  });
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
        var out = render(Handler, { data }, opts.context);

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
  }
};