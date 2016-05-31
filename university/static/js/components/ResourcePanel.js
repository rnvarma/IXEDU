var React = require('react');

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

module.exports = Panel;
