var { State, Navigation } = require('react-router');
var RouteHandlerMixin = require('react-router/modules/RouteHandlerMixin');

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

  routedSubRoute(props) {
    return this.hasChildRoute() && (
      this.getRouteHandler(
        Object.assign({}, {key: this.subRouteKey()}, props)
      )
    );
  },

  // todo: debug why this is called more than it should be
  _handleViewEntered(i) {
    if (i === 0 && this.numActiveRoutes() > this.getRouteDepth()) {
      var r = this.getRoutes().reverse();
      r.shift();
      this.transitionTo(r[0].path);
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