var React = require('react');

var TitleAddPanel = require('./components/TitleAddPanel.js');
var PanelModal = require('./components/ResourcePanelModal.js');
var PanelWidget = require('./components/ResourcePanelWidget.js');

var sortModule = require('html5sortable');
var $ = require('jquery');
var bootstrap = require('bootstrap');

var LESS = require('../less/university_resources.less');

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
  componentDidMount: function() {
    $('.panels').bind('sortupdate', this.props.updateSortOrder);
  },
  componentWillUnmount: function() {
    $('.panels').unbind('sortupdate', this.props.updateSortOrder);
  },
  clickOpenModal: function() {
    $('.modal').modal('show');
    $('.resource-name').focus();
  },
  render: function() {
    return (
      <div className='row pushed-in'>
        <TitleAddPanel
          saveResources={this.props.back}
          title={'Editing Resources'}
          clickAdd={this.clickOpenModal} />
        <PanelWidget
          uni_id={this.props.uni_id}
          panelAttrChange={this.props.panelAttrChange}
          media_url={this.props.media_url}
          removePanel={this.props.removePanel}
          resources={this.props.resources} />
        <PanelModal
          uni={this.props.uni}
          uni_id={this.props.uni_id}
          ajaxResourceAdded={this.props.ajaxResourceAdded}
          ajaxResourceFinished={this.props.ajaxResourceFinished} />
      </div>
    );
  }
});

module.exports = ResourcePanelContainer;
