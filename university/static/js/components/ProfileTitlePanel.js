var React = require('react');

var TitlePanel = React.createClass({
  getInitialState: function() {
    return {
      showLocationSave: false,
      showPopSave: false
    };
  },
  panelStyles: function() {
    return {
      backgroundImage: 'url(' + this.props.media_url + this.props.uni.logo + ')'
    };
  },
  makeLocationEditable: function() {
    if (this.props.editable) {
      this.setState({
        showLocationSave: true
      });
    }
  },
  saveLocationChanges: function() {
    this.props.update_fields(
      this.city.innerText,
      this.st.innerText,
      Number(this.undergrad.innerText.replace(/,/g, '')),
      Number(this.grad.innerText.replace(/,/g, '')),
      Number(this.programSize.innerText.replace(/,/g, ''))
    );
    this.setState({
      showLocationSave: false
    });
  },
  makePopEditable: function() {
    if (this.props.editable) {
      this.setState({
        showPopSave: true
      });
    }
  },
  savePopChanges: function() {
    this.props.update_fields(
      this.city.innerText,
      this.st.innerText,
      Number(this.undergrad.innerText.replace(/,/g, '')),
      Number(this.grad.innerText.replace(/,/g, '')),
      Number(this.programSize.innerText.replace(/,/g, ''))
    );
    this.setState({
      showPopSave: false
    });
  },
  handleEnter: function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();

      e.target.blur();

      if (e.target.classList.contains('location')) {
        this.saveLocationChanges();
      } else {
        this.savePopChanges();
      }
    }
  },
  render: function() {
    var locationEditable = null;
    var popEditable = null;

    if (this.state.showLocationSave) {
      locationEditable = (
        <span
          className="save-button location-edit-button"
          onClick={this.saveLocationChanges} >
          Save Changes
        </span>
      );
    }
    if (this.state.showPopSave) {
      popEditable = (
        <span
          className="save-button pop-edit-button"
          onClick={this.savePopChanges} >
          Save Changes
        </span>
      );
    }

    return (
      <div className="row title-panel" style={this.panelStyles()}>
        <div className="row uni-title">
          {this.props.uni.name}
        </div>
        <div className="row uni-location">
          <span
            ref={(ref) => this.city = ref}
            onKeyDown={this.handleEnter}
            onClick={this.makeLocationEditable}
            contentEditable={this.props.editable}
            className="location uni-city" >
            {this.props.uni.city}
          </span>
          <span
            ref={(ref) => this.st = ref}
            onKeyDown={this.handleEnter}
            onClick={this.makeLocationEditable}
            contentEditable={this.props.editable}
            className="location uni-state" >
            {this.props.uni.state}
          </span>
          {locationEditable}
        </div>
        <div className="row uni-size">
          {popEditable}
          <div className="undergrad-size size-sub">
            <div
              ref={(ref) => this.undergrad = ref}
              onKeyDown={this.handleEnter}
              onClick={this.makePopEditable}
              contentEditable={this.props.editable}
              className="uni-size-number" >
              {this.props.uni.undergrad.toLocaleString()}
            </div>
            <div className="uni-size-desc">
              undergrads
            </div>
          </div>
          <div className="grad-size size-sub">
            <div
              ref={(ref) => this.grad = ref}
              onKeyDown={this.handleEnter}
              onClick={this.makePopEditable}
              contentEditable={this.props.editable}
              className="uni-size-number">
              {this.props.uni.grad.toLocaleString()}
            </div>
            <div className="uni-size-desc">
              grads
            </div>
          </div>
          <div className="program-size size-sub">
            <div
              ref={(ref) => this.programSize = ref}
              onKeyDown={this.handleEnter}
              onClick={this.makePopEditable}
              contentEditable={this.props.editable}
              className="uni-size-number">
              {this.props.uni.program_size}
            </div>
            <div className="uni-size-desc">
              programs
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TitlePanel;
