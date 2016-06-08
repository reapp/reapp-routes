var React = require('react');

var REF_NAME = '__routeHandler__';

module.exports = {

  contextTypes: {
    routeDepth: React.PropTypes.number.isRequired,
    router: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    routeDepth: React.PropTypes.number.isRequired
  },

  getChildContext() {
    let routeDepth = 1;
    if (this.context.routeDepth) {
      routeDepth = this.context.routeDepth;
      routeDepth = routeDepth + 1;
    }
    return {
      routeDepth
    };
  },

  componentDidMount() {
    this._updateRouteComponent(this.refs[REF_NAME]);
  },

  componentDidUpdate() {
    this._updateRouteComponent(this.refs[REF_NAME]);
  },

  componentWillUnmount() {
    this._updateRouteComponent(null);
  },

  _updateRouteComponent(component) {
    if (this.props.routes[this.getRouteDepth]) {
      this.props.routes[this.getRouteDepth].component = component;
    }
  },

  getRouteDepth() {
    if (this.context.routeDepth) {
      return this.context.routeDepth;
    }
    return 1;
  },

  createChildRouteHandler(props) {
    var route = this.props.routes[this.getRouteDepth()];
    var el = route ? React.createElement(route.component, Object.assign({}, props, this.props, { ref: REF_NAME })) : null;
    return el;
  }

};
