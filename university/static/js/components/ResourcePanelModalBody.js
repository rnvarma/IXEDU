var React = require('react');

var $ = require('jquery');

var PanelModalBody = React.createClass({
  getInitialState: function () {
    return {
      name: '',
      desc: '',
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

    outputData.append('resource-name', currentFileState.name);
    outputData.append('resource-desc', currentFileState.desc);
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
  updateName: function(e) {
    this.setState({name: e.target.value});
  },
  updateDesc: function(e) {
    this.setState({desc: e.target.value});
  },
  updateURL: function(e) {
    this.setState({urlValue: e.target.value});
  },
  updateFile: function(e) {
    this.setState({fileValue: e.target.files[0]});
  },
  isActive: function(type) {
    return this.state.type === type;
  },
  render: function() {
    return (
      <div>
        <div className='modal-body'>
          <div className='form-group'>
            <label htmlFor='resource-name' className='control-label'>Name:</label>
            <input
              type='text'
              className='form-control resource-name'
              onChange={this.updateName} />
          </div>
          <div className='form-group'>
            <label htmlFor='resource-desc' className='control-label'>Description:</label>
            <textarea
              className='form-control'
              onChange={this.updateDesc} />
          </div>
          <div className='btn-group btn-group-justified type-buttons'>
            <button type='button'
              className={'btn btn-default res-btn ' + (this.isActive('url') ? 'activated' : '')}
              onClick={() => this.setState({type: 'url'})}>URL</button>
            <button type='button'
              className={'btn btn-default res-btn ' + (this.isActive('file') ? 'activated' : '')}
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
                onChange={this.updateURL} />
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

module.exports = PanelModalBody;
