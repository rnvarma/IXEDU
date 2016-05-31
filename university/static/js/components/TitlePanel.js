var React = require('react');

var TitlePanel = React.createClass({
  render: function() {
    return (
      <div className='col-md-12'>
        <div className='page-heading'>
          {this.props.uni} Resources
          <span
            className='glyphicon glyphicon-plus-sign'
            onClick={this.props.clickOpenModal} />
        </div>
      </div>
    );
  }
});

module.exports = TitlePanel;
