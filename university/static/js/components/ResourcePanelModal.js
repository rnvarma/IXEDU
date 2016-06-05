var React = require('react');

var PureRenderMixin = require('react-addons-pure-render-mixin');

var PanelModalHeader = require('./ResourcePanelModalHeader.js');
var PanelModalBody = require('./ResourcePanelModalBody.js');

var PanelModal = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className='modal fade' tabindex='-1'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <PanelModalHeader uni={this.props.uni} />
            <PanelModalBody
              uni_id={this.props.uni_id}
              ajaxResourceFinished={this.props.ajaxResourceFinished}
              ajaxResourceAdded={this.props.ajaxResourceAdded} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PanelModal;
