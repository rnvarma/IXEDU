var React = require('react');

var $ = require('jquery');
var bootstrap = require('bootstrap');

var PanelModalHeader = require('./ResourcePanelModalHeader.js');
var PanelModalBody = require('./ResourcePanelModalBody.js');

var PanelModal = React.createClass({
  showModal: function() {
    $(this.modal).modal('show');
  },
  ajaxResourceAdded: function(outputData) {
    $(this.modal).modal('hide');
    this.props.ajaxResourceAdded(outputData);
  },
  ajaxResourceFinished: function(outputData, resourceID) {
    this.props.ajaxResourceFinished(outputData, resourceID);
  },
  render: function() {
    return (
      <div className='modal fade' tabindex='-1' ref={(ref) => this.modal = ref}>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <PanelModalHeader uni={this.props.uni} />
            <PanelModalBody
              uni_id={this.props.uni_id}
              ajaxResourceFinished={this.ajaxResourceFinished}
              ajaxResourceAdded={this.ajaxResourceAdded} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PanelModal;
