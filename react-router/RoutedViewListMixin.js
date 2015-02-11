var { State, Navigation } = require('react-router');
var RouteHandlerMixin = require('react-router/mixins/RouteHandler');

// mixin for viewlists
// works with react-router and gives some helper functions
// to manage viewLists

module.exports = {
  mixins: [
    State,
    RouteHandlerMixin,
    Navigation,
  ],

  routedViewListProps() {
    return {
      scrollToStep: this.scrollToStep(),
      onViewEntered: this._handleViewEntered
    };
  },

  scrollToStep() {
    return this.numActiveRoutes() - this.getRouteDepth();
  },

  childRouteHandler(props) {
    if (!this.hasChildRoute())
      return;

    var childProps = Object.assign({}, {key: this.subRouteKey()}, props);
    return this.getRouteHandler(childProps);
  },

  // todo: debug why this is called more than it should be
  _handleViewEntered(i) {
    if (i === 0 && this.numActiveRoutes() > this.getRouteDepth()) {
      var r = this.getRoutes().reverse();
      r.shift();
      setTimeout(() => {
        this.transitionTo(r[0].path)
      }, 60);
    }
  },

  numActiveRoutes() {
    return this.getRoutes().length;
  },

  hasChildRoute() {
    return this.numActiveRoutes() > this.getRouteDepth();
  },

  subRouteKey() {
    return this.getRoutes().reverse()[0].name + this.getParams().id;
  }
};