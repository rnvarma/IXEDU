var React = require('react');

var AdminList = React.createClass({
  handleEnter: function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.target.blur();
      this.props.saveAdminChanges();
    }
  },
  render: function() {
    var self = this;
    var admins = this.props.admins.map((function(obj) {
      var content = null;
      var backgroundStyle = {
        backgroundImage: 'url(' + self.props.media_url + obj.img + ')'
      };

      if (!self.props.editable) {
        var innerContent = null;

        if (obj.phone !== '') {
          innerContent = (
            <div className='phone'>
              <i className='contact-icon glyphicon glyphicon-earphone' />{obj.phone}
            </div>
          );
        }

        content = (
          <div className='admin-contact'>
            <i className='contact-icon glyphicon glyphicon-envelope' />
            <a href={'mailto:' + obj.email}>{obj.email}</a>
            {innerContent}
          </div>
        );
      } else {
        content = (
          <div
            onClick={this.props.showSaveButton}
            onKeyDown={this.handleEnter}
            contentEditable={true}
            className='admin-position'>
            {obj.position}
          </div>
        );
      }

      return (
        <div key={obj.email} className='admin-entry'>
          <div className='admin-img' style={backgroundStyle} />
          <div className='admin-desc'>
            <div className='admin-name'>
              {obj.name}
            </div>
            {content}
          </div>
        </div>
      );
    }).bind(this));

    return (
      <div className='admin-list'>
        {admins}
      </div>
    );
  }
});

module.exports = AdminList;
