// uses react router to run an app, with two options
// renderAsync and renderSync
//   - Sync waits for data then renders
//   - Async renders, then fetches data and re-renders

var React  = require('react');
var Router = require('react-router');
var { Promise } = require('bluebird');

function fetchAllData(routes, params) {
  var promises = routes
    .filter(route => route.handler.fetchData)
    .reduce((promises, route) => {
      promises[route.name] = route.handler.fetchData(params);
      return promises;
    }, {});

  return Promise.props(promises);
}

function render(Handler, data) {
  React.render(<Handler data={data} />, document.getElementById('app'));
}

module.exports = {
  sync(routes) {
    Router.run(routes, Router.HistoryLocation, (Handler, state) => {
      fetchAllData(state.routes, state.params).then(data => {
        return render(Handler, data);
      });
    });
  },

  async(routes) {
    Router.run(routes, Router.HistoryLocation, (Handler, state) => {
      render(Handler, state);
      fetchAllData(state.routes, state.params).then(data => {
        // only re-render if we fetched data
        if (Object.keys(data).length)
          render(Handler, data);
      });
    });
  }
};