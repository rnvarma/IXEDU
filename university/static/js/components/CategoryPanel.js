var React = require('react');

var CategoryPanel = React.createClass({
  slugify: function(name) {
    return name.replace(' ', '').replace('/','-')
  },
  render: function() {
    var self = this;

    var subcats = this.props.category.subcats.map(function(subcat) {
      var editButton = null;
      var editSubcategory = () => {
        window.location.assign(
          window.location + '/form?cat=' + self.slugify(self.props.category.name)
          + '&subcat=' + self.slugify(subcat.name)
        );
      };

      if (self.props.editable) {
        editButton = (
          <span className='subcat-edit edit-button' onClick={editSubcategory}>
            Edit
          </span>
        );
      }

      return (
        <div className='row subcat-subcat' key={subcat.name}>
          <div className='subcat-title row'>
            <h4 className='subcat-title-txt'>
              {subcat.name}
              {editButton}
            </h4>
          </div>
          <div className='subcat-desc row'>
            <p className={'subcat-desc-txt ' + (subcat.desc ? '' : 'subcat-empty')}>
              {subcat.desc ? subcat.desc : 'No description provided' }
            </p>
          </div>
        </div>
      );
    });

    return (
      <div className='row subcat-panel'>
        {subcats}
      </div>
    );
  }
});

module.exports = CategoryPanel;
