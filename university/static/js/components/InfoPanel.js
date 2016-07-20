var React = require('react');

var InfoPanel = React.createClass({
  render: function() {
    var editButton = null;

    if (this.props.editable && this.props.showButton) {
      editButton = (
        <span onClick={this.props.editButton} className='edit-button'>
          {this.props.editText}
        </span>
      );
    }

    return (
      <div className='panel'>
        <div className='panel-heading'>
          {this.props.title}
          {editButton}
        </div>
        <div className='panel-body'>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = InfoPanel;
