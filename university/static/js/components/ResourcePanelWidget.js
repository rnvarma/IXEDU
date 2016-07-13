var React = require('react');

var Panel = require('./ResourcePanel.js');

var PanelWidget = React.createClass({
  panelKeydown: function(resourceID, e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.target.blur();
    }
  },
  render: function() {
    var self = this;
    var panels = self.props.resources.map(function (resourceObj) {
      return (
          <Panel
            key={resourceObj.name}
            keydown={self.panelKeydown}
            media_url={self.props.media_url}
            attrChange={self.props.panelAttrChange}
            removePanel={self.props.removePanel}
            resource={resourceObj} />
      );
    });
    return (
      <div className='panels'>
        {panels}
      </div>
    );
  }
});

module.exports = PanelWidget;
