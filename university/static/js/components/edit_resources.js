var React = require('react');

var TitlePanel = require('./TitlePanel.js');
var PanelModal = require('./ResourcePanelModal.js');
var PanelWidget = require('./ResourcePanelWidget.js');

var $ = require('jquery');

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
  }
});

var ResourcePanelContainer = React.createClass({
  ajaxResourceAdded: function(outputData) {
    this.panelWidget.addPanel(outputData);
  },
  ajaxResourceFinished: function(outputData, resourceID) {
    this.panelWidget.updatePanelID(outputData.resourceName, resourceID);
  },
  clickOpenModal: function() {
    this.panelModal.showModal();
  },
  render: function() {
    return (
      <div className='row pushed-in'>
        <TitlePanel
          uni={this.props.uni}
          clickOpenModal={this.clickOpenModal} />
        <PanelWidget
          uni_id={this.props.uni_id}
          ref={(ref) => this.panelWidget = ref} />
        <PanelModal
          ref={(ref) => this.panelModal = ref}
          uni={this.props.uni}
          uni_id={this.props.uni_id}
          ajaxResourceAdded={this.ajaxResourceAdded}
          ajaxResourceFinished={this.ajaxResourceFinished} />
      </div>
    );
  }
});

module.exports = ResourcePanelContainer;
