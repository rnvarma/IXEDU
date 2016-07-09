var React = require('react');
var $ = require('jquery');

var TitlePanel = require('./components/ProfileTitlePanel');
var ContentContainer = require('./components/ContentContainer');
var TwoColumn = require('./components/TwoColumn');
var InfoPanel = require('./components/InfoPanel');
var AdminList = require('./components/AdminList');
var ResourceList = require('./components/ResourceList');
var CategoriesListPanel = require('./components/CategoriesListPanel');
var CategoryPanel = require('./components/CategoryPanel');

var UniversityProfile = React.createClass({
  getInitialState: function() {
    return {
      uni: {
        name: '',
        state: '',
        city: '',
        undergrad: 0,
        grad: 0,
        program_size: 1,
        logo: ''
      },
      admins: [],
      collabs: [],
      resources: [],
      categories: [],
      selectedCategory: 0
    };
  },
  componentWillMount: function() {
    this.setState({
      uni: this.props.uni,
      admins: this.props.admins,
      collabs: this.props.collabs,
      resources: this.props.resources,
      categories: this.props.categories,
    });
  },
  changeSelectedCategory: function(i) {
    this.setState({
      selectedCategory: i
    });
  },
  render: function() { var collaborators = null;

    if (this.props.editable) {
      collaborators = (
        <InfoPanel editable={this.props.editable} title='Collaborators'>
          <AdminList admins={this.state.collabs} />
        </InfoPanel>
      );
    }

    var leftColumn = (
      <div className='left-column'>
        <InfoPanel editable={this.props.editable} title='Title IX Office'>
          <AdminList
            media_url={this.props.media_url}
            editable={this.props.editable}
            admins={this.state.admins} />
        </InfoPanel>
        {collaborators}
        <InfoPanel editable={this.props.editable} title='Resources'>
          <ResourceList
            media_url={this.props.media_url}
            resources={this.state.resources} />
        </InfoPanel>
      </div>
    );
    var rightColumn = (
      <div className='right-column'>
        <CategoriesListPanel
          categories={this.state.categories}
          changeSelectedCategory={this.changeSelectedCategory}
          selectedCategory={this.state.selectedCategory} />
        <CategoryPanel
          category={this.state.categories[this.state.selectedCategory]} />
      </div>
    );

    return (
      <div class='page-container'>
        <TitlePanel
          media_url={this.props.media_url}
          uni={this.state.uni}
          editable={this.props.editable}
          update_fields={this.updateTitlePanelFields} />
        <ContentContainer containerClass='university-profile-content'>
          <TwoColumn
            leftChild={leftColumn}
            rightChild={rightColumn} />
        </ContentContainer>
      </div>
    );
  }
});

module.exports = UniversityProfile;
