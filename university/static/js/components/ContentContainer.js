var React = require('react');

var ContentContainer = React.createClass({
  render: function() {
    return (
      <div className={'row content-container ' + this.props.containerClass}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = ContentContainer;
