var React = require('react');

var CategoryPanel = React.createClass({
  render: function() {
    var subcats = this.props.category.subcats.map(function(subcat) {
      return (
        <div className='row subcat-subcat' key={subcat.name}>
          <div className='subcat-title row'>
            <h4 className='subcat-title-txt'>
              {subcat.name}
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
