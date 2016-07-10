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

var ResourcePanelContainer = require('./edit_resources');

var LESS = require('../less/university_profile.less');

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
        id: 0,
        logo: ''
      },
      admins: [],
      collabs: [],
      resources: [],
      categories: [],
      selectedCategory: 0,
      editingResources: false
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
  updateTitlePanelFields: function(city, st, ug, g, ps) {
    var new_uni = Object.assign({}, this.state.uni);

    new_uni.city = city;
    new_uni.state = st;
    new_uni.undergrad = ug;
    new_uni.grad = g;
    new_uni.program_size = ps;

    this.setState({
      uni: new_uni
    }, () => {
      $.ajax('/changeunimetadata', {
        type: 'POST',
        data: {
          u_name: this.state.uni.name,
          city: this.state.uni.city,
          state: this.state.uni.state,
          ug: this.state.uni.undergrad,
          g: this.state.uni.grad,
          ps: this.state.uni.program_size
        }
      })
    });
  },
  getProfileStyle: function() {
    if (this.state.editingResources) {
      return {
        left: -100 + 'vw',
        top: 0
      };
    } else {
      return {
        left: 0,
        top: 0
      };
    }
  },
  getResourcesStyle: function() {
    if (this.state.editingResources) {
      return {
        left: -100 + 'vw',
        top: -500
      };
    } else {
      return {
        left: 0,
        top: -500
      };
    }
  },
  editResources: function() {
    var self = this;
    var popState = function() {
      self.setState({
        editingResources: !self.state.editingResources
      });
    };

    this.setState({
      editingResources: true
    });

    history.pushState({}, '', window.location.pathname + '/editresources');

    window.removeEventListener('popstate', popState);
    window.addEventListener('popstate', popState);
  },
  render: function() {
    var collaborators = null;

    if (this.props.editable) {
      collaborators = (
        <InfoPanel title='Collaborators'>
          <AdminList
            media_url={this.props.media_url}
            editable={this.props.editable}
            admins={this.state.collabs} />
        </InfoPanel>
      );
    }

    var leftColumn = (
      <div className='left-column'>
        <InfoPanel title='Title IX Office'>
          <AdminList
            media_url={this.props.media_url}
            editable={this.props.editable}
            admins={this.state.admins} />
        </InfoPanel>
        {collaborators}
        <InfoPanel
          editable={this.props.editable}
          editButton={this.editResources}
          title='Resources'>
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
      <div className='page-container'>
        <TitlePanel
          media_url={this.props.media_url}
          uni={this.state.uni}
          editable={this.props.editable}
          update_fields={this.updateTitlePanelFields} />
        <ContentContainer
          style={this.getProfileStyle()}
          containerClass='university-profile-content'>
          <TwoColumn
            leftChild={leftColumn}
            rightChild={rightColumn} />
        </ContentContainer>
        <ContentContainer
          style={this.getResourcesStyle()}
          containerClass='university-edit-resources-content'>
          <ResourcePanelContainer
            uni={this.props.uni.name}
            uni_id={this.props.uni.id}
            media_url={this.props.media_url} />
        </ContentContainer>
      </div>
    );
  }
});

module.exports = UniversityProfile;
