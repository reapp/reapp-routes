var React = require('react');
var assign = require('react/lib/Object.assign');

var REF_NAME = '__routeHandler__';

module.exports = {

  contextTypes: {
    routeDepth: React.PropTypes.number.isRequired,
    router: React.PropTypes.func.isRequired
  },

  childContextTypes: {
    routeDepth: React.PropTypes.number.isRequired
  },

  getChildContext() {
    return {
      routeDepth: this.context.routeDepth + 1
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
    // this.context.router.setRouteComponentAtDepth(this.getRouteDepth(), component);
    this.props.routes[this.getRouteDepth()].component = this.props.route.component;
  },

  getRouteDepth() {
    return this.context.routeDepth;
  },

  createChildRouteHandler(props) {
    var route = this.context.router.getRouteAtDepth(this.getRouteDepth());
    var el = route ? React.createElement(route.handler, assign({}, props || this.props, { ref: REF_NAME })) : null;
    return el;
  }

};
