var React = require('react');

var CategoriesListPanel = React.createClass({
  getHeaderStyle: function() {
    return {
      width: 100.0 / this.props.categories.length + '%'
    };
  },
  getActiveStyle: function(i) {
    return {
      left: (100.0 / this.props.categories.length * i)
          + (50.0 / this.props.categories.length) + '%'
    };
  },
  render: function() {
    var self = this;

    var active = (
      <div className='category-active'
        style={this.getActiveStyle(this.props.selectedCategory)} />
    );

    var categories = this.props.categories.map(function(obj, ind) {
      return (
        <div className='category-header'
             onClick={() => self.props.changeSelectedCategory(ind)}
             style={self.getHeaderStyle()}
             key={ind}>
          {obj.name.split(' ')[0]}
        </div>
      );
    });

    return (
      <div className='category-panel-heading'>
        {categories}
        {active}
      </div>
    );
  }
});

module.exports = CategoriesListPanel;
