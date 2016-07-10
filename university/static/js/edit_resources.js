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
  getInitialState: function() {
    return {
      resources: []
    };
  },
  ajaxResourceAdded: function(outputData) {
    var newResource = {
      resourceID: 1000
    };
    for (var attr in outputData) { newResource[attr] = outputData[attr]; }

    this.setState({
      resources: this.state.resources.concat(newResource),
    });

    $('.modal').modal('hide');
    $('.panels').sortable();
  },
  ajaxResourceFinished: function(outputData, resourceID) {
    this.setState(function(prevState, currentProps) {
      return {
        resources: prevState.resources.map(function (obj) {
          var newObj = obj;
          if (obj.resourceName === outputData.resourceName) {
            newObj.resourceID = resourceID;
          }

          return newObj;
        })
      };
    });
  },
  removePanel: function(resourceID) {
    this.setState(function(prevState, currentProps) {
      return {
        resources: prevState.resources.filter(function(obj, i) {
          return obj.resourceID !== resourceID;
        }),
      };
    });

    $('.panels').sortable();
    $.post('/removeresource', {'resource_id': resourceID});
  },
  panelAttrChange: function(resourceID, e, attrName) {
    var resourceIndex = this.state.resources.findIndex(function (obj) {
      return obj.resourceID === resourceID;
    });
    var newName = e.target.textContent;

    var newResources = $.extend(true, [], this.state.resources);
    newResources[resourceIndex][attrName] = newName;

    this.setState({
      resources: newResources
    }, function () {
      $.ajax({
        url: '/changeresource',
        type: 'POST',
        data: {
          'file_id': resourceID,
          'name': newResources[resourceIndex].resourceName,
          'desc': newResources[resourceIndex].resourceDesc
        }
      });
    });
  },
  updateSortOrder: function(e, ui) {
    var self = this;
    var to = ui.elementIndex;
    var from = ui.oldElementIndex;

    var res = $.extend(true, [], this.state.resources);
    res.splice(to, 0, res.splice(from, 1)[0]);

    this.setState({
        resources: res
    }, function () {
      $.ajax({
        url: '/changeresourceorder',
        type: 'POST',
        data: {
          neworder: self.state.resources.map(function (obj) {
            return obj.resourceID;
          })
        }
      });
    });
  },
  componentDidMount: function() {
    var self = this;

    $.get('/getresources?u_id=' + this.props.uni_id, {}, function (resp) {
      self.setState({
        resources: self.state.resources.concat(resp.files)
      });

      $('.panels').sortable({
        items: '.panel-col',
        handle: '.glyphicon-th',
        placeholderClass: 'col-md-4 panel-placeholder'
      });
    });

    $('.panels').bind('sortupdate', this.updateSortOrder);
  },
  componentWillUnmount: function() {
    $('.panels').unbind('sortupdate', this.updateSortOrder);
  },
  clickOpenModal: function() {
    $('.modal').modal('show');
    $('.resource-name').focus();
  },
  render: function() {
    return (
      <div className='row pushed-in'>
        <TitleAddPanel
          title={'Editing Resources'}
          clickAdd={this.clickOpenModal} />
        <PanelWidget
          uni_id={this.props.uni_id}
          panelAttrChange={this.panelAttrChange}
          media_url={this.props.media_url}
          removePanel={this.removePanel}
          resources={this.state.resources} />
        <PanelModal
          uni={this.props.uni}
          uni_id={this.props.uni_id}
          ajaxResourceAdded={this.ajaxResourceAdded}
          ajaxResourceFinished={this.ajaxResourceFinished} />
      </div>
    );
  }
});

module.exports = ResourcePanelContainer;
