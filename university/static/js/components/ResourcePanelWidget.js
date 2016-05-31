var React = require('react');

var $ = require('jquery');
var sortModule = require('html5sortable');

var Panel = require('./ResourcePanel.js');

var PanelWidget = React.createClass({
  getInitialState: function() {
    return {
      resources: [],
    };
  },
  addPanel: function(outputData) {
    var newResource = {
      resourceID: 1000
    };
    for (var attr in outputData) { newResource[attr] = outputData[attr]; }

    this.setState(function(prevState, currentProps) {
      return {
        resources: prevState.resources.concat(newResource),
      };
    });
  },
  updatePanelID: function(resourceName, resourceID) {
    this.setState(function(prevState, currentProps) {
      return {
        resources: prevState.resources.map(function (obj) {
          var newObj = obj;
          if (obj.resourceName === resourceName) {
            newObj.resourceID = resourceID;
          }

          return newObj;
        }),
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

    $.post('/removeresource', {'resource_id': resourceID});
  },
  panelKeydown: function(resourceID, e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.target.blur();
    }
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
    });

    $.ajax({
      url: '/changeresource',
      type: 'POST',
      data: {
        'file_id': resourceID,
        'name': newResources[resourceIndex].resourceName,
        'desc': newResources[resourceIndex].resourceDesc
      }
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
  componentDidUpdate: function() {
    $('.panels').sortable();
  },
  componentDidMount: function() {
    var self = this;

    $.get('/getresources?u_id=' + this.props.uni_id, {}, function (resp) {
      self.setState(function(prevState, currentProps) {
        return {
          resources: prevState.resources.concat(resp.files)
        };
      });
    });

    $('.panels').sortable({
      items: '.panel-col',
      handle: '.glyphicon-th',
      placeholderClass: 'col-md-4 panel-placeholder'
      });
    $('.panels').bind('sortupdate', this.updateSortOrder);
  },
  componentWillUnmount: function() {
    $('.panels').unbind('sortupdate', this.updateSortOrder);
  },
  render: function() {
    var self = this;
    var panels = self.state.resources.map(function (resourceObj) {
      return (
          <Panel
            key={resourceObj.resourceName}
            keydown={self.panelKeydown}
            attrChange={self.panelAttrChange}
            removePanel={self.removePanel}
            resource={resourceObj} />
      );
    });
    return (
      <div className='panels' ref={(ref) => this.panels = ref}>
        {panels}
      </div>
    );
  }
});

module.exports = PanelWidget;
