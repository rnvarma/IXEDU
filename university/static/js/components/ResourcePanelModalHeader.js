var React = require('react');

var PureRenderMixin = require('react-addons-pure-render-mixin');

var PanelModalHeader = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className='modal-header'>
        <button type='button' className='close' data-dismiss='modal'>
          <span>&times;</span>
        </button>
        <h4 className='modal-title'>New resource for {this.props.uni}</h4>
      </div>
    );
  }
});

module.exports = PanelModalHeader;
