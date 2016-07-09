global.jQuery = require('jquery');

var exportModules = {
  'React': require('react'),
  'ReactDOM': require('react-dom'),
  'ResourcePanelContainer': require('../../university/static/js/edit_resources.js'),
  'UniversityProfile': require('../../university/static/js/profile.js')
};

for (module in exportModules) {
  var mod = exportModules[module];

  window[module] = mod;
}
