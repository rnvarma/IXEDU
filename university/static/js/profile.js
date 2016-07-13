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
  componentDidMount: function() {
    $('.panels').sortable({
      items: '.panel-col',
      handle: '.glyphicon-th',
      placeholderClass: 'col-md-4 panel-placeholder'
    });
  },
  componentWillMount: function() {
    this.setState({
      uni: this.props.uni,
      admins: this.props.admins,
      collabs: this.props.collabs,
      resources: this.props.resources,
      categories: this.props.categories,
      editingResources: window.location.pathname.indexOf('editresources') > -1
    });
  },
  changeSelectedCategory: function(i) {
    this.setState({
      selectedCategory: i
    });
  },
  ajaxResourceAdded: function(outputData) {
    var newResource = {
      id: 1000
    };
    for (var attr in outputData) { newResource[attr] = outputData[attr]; }

    this.setState({
      resources: this.state.resources.concat(newResource),
    });

    $('.modal').modal('hide');
    $('.panels').sortable();
  },
  ajaxResourceFinished: function(outputData, id) {
    this.setState(function(prevState, currentProps) {
      return {
        resources: prevState.resources.map(function (obj) {
          var newObj = obj;
          if (obj.resourceName === outputData.resourceName) {
            newObj.id = id;
          }

          return newObj;
        })
      };
    });
  },
  removePanel: function(id) {
    this.setState(function(prevState, currentProps) {
      return {
        resources: prevState.resources.filter(function(obj, i) {
          return obj.id !== id;
        }),
      };
    });

    $('.panels').sortable();
    $.post('/removeresource', {'resource_id': id});
  },
  panelAttrChange: function(id, e, attrName) {
    var resourceIndex = this.state.resources.findIndex(function (obj) {
      return obj.id === id;
    });
    var newName = e.target.textContent;

    var newResources = $.extend(true, [], this.state.resources);
    newResources[resourceIndex][attrName] = newName;

    this.setState({
      resources: newResources
    }, function () {
      $.ajax({
        url: '/changeresource',
        type: 'POST',
        data: {
          'file_id': id,
          'name': newResources[resourceIndex].name,
          'desc': newResources[resourceIndex].desc
        }
      });
    });
  },
  updateSortOrder: function(e, ui) {
    var self = this;
    var to = ui.elementIndex;
    var from = ui.oldElementIndex;

    var res = $.extend(true, [], this.state.resources);
    res.splice(to, 0, res.splice(from, 1)[0]);

    this.setState({
        resources: res
    }, function () {
      $.ajax({
        url: '/changeresourceorder',
        type: 'POST',
        data: {
          neworder: self.state.resources.map(function (obj) {
            return obj.id;
          })
        }
      });
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
  popState: function() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    this.setState({
      editingResources: !this.state.editingResources
    });
  },
  editResources: function() {
    this.setState({
      editingResources: true
    });

    history.pushState({}, '', window.location.pathname + '/editresources');

    window.addEventListener('popstate', this.popState);
  },
  back: function() {
    this.setState({
      editingResources: false
    });

    history.pushState( {}, '', window.location.pathname.substring(
      0, window.location.pathname.lastIndexOf('/editresources')
    ));

    window.addEventListener('popstate', this.popState);
  },
  render: function() {
    var collaborators = null;
    var resources = null;

    if (this.props.editable) {
      collaborators = (
        <InfoPanel title='Collaborators'>
          <AdminList
            media_url={this.props.media_url}
            editable={this.props.editable}
            admins={this.state.collabs} />
        </InfoPanel>
      );

      resources = (
        <ContentContainer
          style={this.getResourcesStyle()}
          containerClass='university-edit-resources-content'>
          <ResourcePanelContainer
            uni={this.props.uni.name}
            uni_id={this.props.uni.id}
            back={this.back}
            updateSortOrder={this.updateSortOrder}
            ajaxResourceAdded={this.ajaxResourceAdded}
            ajaxResourceFinished={this.ajaxResourceFinished}
            removePanel={this.removePanel}
            panelAttrChange={this.panelAttrChange}
            resources={this.state.resources}
            media_url={this.props.media_url} />
        </ContentContainer>
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
        {resources}
      </div>
    );
  }
});

module.exports = UniversityProfile;
