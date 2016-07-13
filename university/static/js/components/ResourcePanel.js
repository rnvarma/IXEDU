var React = require('react');

var Panel = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return (
         nextProps.resource.name !== this.props.resource.name
      || nextProps.resource.desc !== this.props.resource.desc);
  },
  render: function() {
    var href = '';
    var res_location = '';

    if (this.props.resource.type === 'file') {
      res_location = this.props.resource.fileValue.name.replace(/\ /g, '_');

      if (res_location.indexOf('uni_files') === -1) {
        res_location = 'uni_files/' + res_location;
      }

      href = this.props.media_url + res_location;
    } else {
      res_location = this.props.resource.urlValue;
      href = this.props.resource.urlValue;
    }

    return (
      <div key={this.props.resource_id} className="col-md-4 panel-col">
        <div className="panel">
          <div className="panel-heading">
            <span className="glyphicon glyphicon-th" />
            <div
              onKeyDown={(e) => this.props.keydown(this.props.resource.id, e)}
              onBlur={(e) =>
                this.props.attrChange(this.props.resource.id, e, 'name')}
              contentEditable="true"
              className="panel-title">
              {this.props.resource.name}
            </div>
            <span
              className="glyphicon glyphicon-remove"
              onClick={() => this.props.removePanel(this.props.resource.id)} />
          </div>
          <div className="panel-body">
            <div
              onKeyDown={(e) => this.props.keydown(this.props.resource.id, e)}
              onBlur={(e) =>
                this.props.attrChange(this.props.resource.id, e, 'desc')}
              contentEditable="true"
              className="resource-description">
              {this.props.resource.desc}
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
