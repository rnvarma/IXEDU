var React = require('react');

var ResourceList = React.createClass({
  render: function() {
    var self = this;
    var resources = this.props.resources.map(function(obj) {
      var imageStyle = {
        backgroundImage: 'url(' + self.props.media_url + obj.image + ')'
      };
      var href = '';

      if (obj.type === 'file') {
        href = self.props.media_url + obj.fileValue.name;
      } else {
        href = obj.urlValue;
      }

      return (
        <div key={obj.desc} className='resources-entry'>
          <a href={href}>
            <div className='resource-image' style={imageStyle} />
            <div className='resource-desc'>
              <div className='resource-name'>
                {obj.name}
              </div>
              <div className='resource-description'>
                {obj.desc}
              </div>
            </div>
          </a>
        </div>
      );
    });

    return (
      <div className='resource-list'>
        {resources}
      </div>
    );
  }
});

module.exports = ResourceList;
