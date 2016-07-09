var React = require('react');

var TitlePanel = React.createClass({
  popEstimate: function(population) {
    return Math.round(population / 1000) + 'K';
  },
  panelStyles: function() {
    return {
      backgroundImage: 'url(' + this.props.media_url + this.props.uni.logo + ')'
    };
  },
  render: function() {
    var editableContent = null;

    if (this.props.editable) {
      var editableContent = (
        <button
          className="edit-button"
          onClick={this.editProps} />
      );
    }

    return (
      <div className="row title-panel" style={this.panelStyles()}>
        <div className="row uni-title">
          {this.props.uni.name}
        </div>
        <div className="row uni-location">
          <span className="uni-city">
            {this.props.uni.city}
          </span>
          <span className="uni-state">
            {this.props.uni.state}
          </span>
        </div>
        <div className="row uni-size">
          <div className="undergrad-size size-sub">
            <div className="uni-size-number">
              {this.props.uni.undergrad.toLocaleString()}
            </div>
            <div className="uni-size-desc">
              undergrads
            </div>
          </div>
          <div className="grad-size size-sub">
            <div className="uni-size-number">
              {this.props.uni.grad.toLocaleString()}
            </div>
            <div className="uni-size-desc">
              grads
            </div>
          </div>
          <div className="program-size size-sub">
            <div className="uni-size-number">
              {this.props.uni.program_size}
            </div>
            <div className="uni-size-desc">
              programs
            </div>
          </div>
          {editableContent}
        </div>
      </div>
    );
  }
});

module.exports = TitlePanel;
