global.jQuery = require('jquery');

var exportModules = {
  'React': require('react'),
  'ReactDOM': require('react-dom'),
  'ResourcePanelContainer': require('../../university/static/js/components/edit_resources.js')
};

for (module in exportModules) {
  var mod = exportModules[module];

  window[module] = mod;
}
