var React = require('react');
var assign = require('react/lib/Object.assign');
var PropTypes = require('react-router/modules/PropTypes');

var REF_NAME = '__routeHandler__';

module.exports = {

  contextTypes: {
    routeDepth: PropTypes.number.isRequired,
    router: PropTypes.router.isRequired
  },

  childContextTypes: {
    routeDepth: PropTypes.number.isRequired,
    animations: PropTypes.object
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
    this.context.router.setRouteComponentAtDepth(this.getRouteDepth(), component);
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
