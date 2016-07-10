var React = require('react');

var ContentContainer = React.createClass({
  render: function() {
    return (
      <div
        style={this.props.style}
        className={'row content-container ' + this.props.containerClass}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = ContentContainer;
