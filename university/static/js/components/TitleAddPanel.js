var React = require('react');

var TitleAddPanel = React.createClass({
  render: function() {
    return (
      <div className='col-md-12'>
        <div className='page-heading'>
          {this.props.title}
          <span
            className='glyphicon glyphicon-plus-sign'
            onClick={this.props.clickAdd} />
        </div>
      </div>
    );
  }
});

module.exports = TitleAddPanel;