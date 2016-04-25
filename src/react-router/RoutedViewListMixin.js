var ParentRouteMixin = require('./ParentRouteMixin');

// mixin for viewlists
// works with react-router and gives some helper functions
// to manage viewLists

module.exports = Object.assign({}, ParentRouteMixin, {

  routedViewListProps(props) {
    return {
      scrollToStep: this.scrollToStep(),
      onViewEntered: (i) => {
        if (props && props.onViewEntered)
          props.onViewEntered(i);

        this._handleViewEntered(i);
      }
    };
  },

  scrollToStep() {
    return this.numActiveRoutes() - this.getRouteDepth();
  },

  childRouteHandler(props) {
    return this.createChildRouteHandler(props);
  },

  // todo: debug why this is called more than it should be
  _handleViewEntered(i) {
    if (i === 0 && this.numActiveRoutes() > this.getRouteDepth()) {
      var r = this.props.routes.reverse();
      r.shift();
      setTimeout(() => {
        this.context.router.push(r[0].path)
      });
    }
  },

  numActiveRoutes() {
    return this.props.routes.length;
  },

  hasChildRoute() {
    return this.numActiveRoutes() > this.getRouteDepth();
  },

  subRouteKey() {
    return this.props.routes.reverse()[0].name
      + this.context.router.getCurrentParams().id;
  }
});
