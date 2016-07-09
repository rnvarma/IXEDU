var React = require('react');

var InfoPanel = React.createClass({
  render: function() {
    return (
      <div className='panel'>
        <div className='panel-heading'>
          {this.props.title}
        </div>
        <div className='panel-body'>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = InfoPanel;
