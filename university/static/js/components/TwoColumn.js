var React = require('react');

var TwoColumn = React.createClass({
  render: function() {
    return (
      <div className='two-column'>
        <div className='row'>
          <div className={'col-md-4 ' + (this.props.leftContainerClass || '')}>
            {this.props.leftChild}
          </div>
          <div className={'col-md-8 ' + (this.props.rightContainerClass || '')}>
            {this.props.rightChild}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TwoColumn;
