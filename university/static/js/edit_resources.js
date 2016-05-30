var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var PureRenderMixin = React.addons.PureRenderMixin;
var LinkedStateMixin = React.addons.LinkedStateMixin;

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

var PanelModalBody = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function () {
    return {
      resourceName: '',
      resourceDesc: '',
      type: 'url',
      urlValue: '',
      fileValue: {}
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();

    var currentFileState = this.state;
    var outputData = new FormData();
    var self = this;

    outputData.append('resource-name', currentFileState.resourceName);
    outputData.append('resource-desc', currentFileState.resourceDesc);
    outputData.append('type', currentFileState.type);
    if (this.state.type === 'url') {
      outputData.append('url', currentFileState.urlValue);
    } else {
      outputData.append('file', currentFileState.fileValue);
    }
    outputData.append('university_id', this.props.uni_id);

    $.ajax({
      url: '/addresource',
      type: 'POST',
      data: outputData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log('added resource ' + response.resource_added);
        self.props.ajaxResourceFinished(currentFileState, response.resource_added);
      }
    });

    this.props.ajaxResourceAdded(currentFileState);
  },
  updateFile: function(e) {
    this.setState({fileValue: e.target.files[0]});
  },
  isActive: function(type) {
    return this.state.type === type;
  },
  componentDidMount: function() {
    this.urlButton.click();
  },
  render: function() {
    return (
      <div>
        <div className='modal-body'>
          <div className='form-group'>
            <label htmlFor='resource-name' className='control-label'>Name:</label>
            <input
              type='text'
              className='form-control'
              valueLink={this.linkState('resourceName')} />
          </div>
          <div className='form-group'>
            <label htmlFor='resource-desc' className='control-label'>Description:</label>
            <textarea
              className='form-control'
              valueLink={this.linkState('resourceDesc')} />
          </div>
          <div className='btn-group btn-group-justified type-buttons'>
            <button type='button'
              className={'btn btn-default res-btn ' + (this.isActive('url') ? 'activated' : '')}
              ref={(ref) => this.urlButton = ref}
              onClick={() => this.setState({type: 'url'})}>URL</button>
            <button type='button'
              className={'btn btn-default res-btn ' + (this.isActive('file') ? 'activated' : '')}
              ref={(ref) => this.fileButton = ref}
              onClick={() => this.setState({type: 'file'})}>File</button>
          </div>
          <div className='input-fields'>
            <div className={'form-group ' + (this.isActive('file') ? '' : 'hidden')}>
              <label className='control-label'>Select File</label>
              <input className='form-control' type='file' onChange={this.updateFile} />
            </div>
            <div className={'form-group ' + (this.isActive('url') ? '' : 'hidden')}>
              <label className='control-label'>URL:</label>
              <input
                className='form-control'
                valueLink={this.linkState('urlValue')} />
            </div>
          </div>
        </div>
        <div className='modal-footer'>
          <button type='button' className='btn btn-default' data-dismiss='modal'>
            Cancel
          </button>
          <button type='button' className='btn btn-primary' onClick={this.handleSubmit}>
            Add Resource
          </button>
        </div>
      </div>
    );
  }
});

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

var Panel = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return (
         nextProps.resource.resourceName !== this.props.resource.resourceName
      || nextProps.resource.resourceDesc !== this.props.resource.resourceDesc);
  },
  render: function() {
    var href = '';
    var res_location = '';

    if (this.props.resource.type === 'file') {
      res_location = this.props.resource.fileValue.name.replace(/\ /g, '_');
      href = 'uni_files/' + res_location;
    } else {
      res_location = this.props.resource.urlValue;
      href = this.props.resource.urlValue;
    }

    return (
      <div className="col-md-4 panel-col">
        <div className="panel">
          <div className="panel-heading">
            <span className="glyphicon glyphicon-th" />
            <div
              onKeyDown={(e) => this.props.keydown(this.props.resource.resourceID, e)}
              onBlur={(e) =>
                this.props.attrChange(this.props.resource.resourceID, e, 'resourceName')}
              contentEditable="true"
              className="panel-title">
              {this.props.resource.resourceName}
            </div>
            <span
              className="glyphicon glyphicon-remove"
              onClick={() => this.props.removePanel(this.props.resource.resourceID)} />
          </div>
          <div className="panel-body">
            <div
              onKeyDown={(e) => this.props.keydown(this.props.resource.resourceID, e)}
              onBlur={(e) =>
                this.props.attrChange(this.props.resource.resourceID, e, 'resourceDesc')}
              contentEditable="true"
              className="resource-description">
              {this.props.resource.resourceDesc}
            </div>
            <div className="resource-type">
              {this.props.resource.type}
            </div>
            <div className="resource-area">
              <a href={href} target="_blank">{res_location}</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

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
        <ReactCSSTransitionGroup
          transitionName='panel-animation'
          transitionEnterTimeout={500}
          transitionEnter={true}
          transitionLeave={false}>
          {panels}
        </ReactCSSTransitionGroup>
      </div>
    );
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

ReactDOM.render(
  <ResourcePanelContainer uni={CONFIG.uni_name} uni_id={CONFIG.uni_id} />,
  document.getElementById('content')
);
