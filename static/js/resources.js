function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
  }
});

$('.panels').click(function(e) {
  if (e.target.id.indexOf('remove_') > -1) {
    $.post('/removeresource', {'resource_id': e.target.id.slice(7)},
      function (response) {
        var target = $('#remove_' + response.resource_removed).closest('.col-md-4');
        target.hide('slow', function(){ target.remove(); });
      }
    );
  }
});

$('#add_resource').click(function(e) {
  $('#resource_modal').modal();
  $('#button-link').trigger('click');
});

$('.type-buttons').click(function(e) {
  var type = e.target.id.slice(7);

  $(e.target).closest('.btn-group').find('.res-btn').removeClass('activated');
  $(e.target).addClass('activated');

  $('.input-fields').find('.form-group').hide('fast');
  $('#input-' + type).show('slow');
});

$('#submit').click(function(e) {
  e.preventDefault();

  $('#res-form').trigger('submit');
});

$('#res-form').submit(function(e) {
  e.preventDefault();

  var outputData = new FormData($('#res-form')[0]);
  outputData.append('type', $('.res-btn').filter(function (elem, val) {
    return $(val).hasClass('activated');
  })[0].id.slice(7));
  outputData.append('university_id', getCookie('university_id'));

  $.ajax({
    url: '/addresource',
    type: 'POST',
    data: outputData,
    processData: false,
    contentType: false,
    success: function (response) {
      var is_link = outputData.get('type').indexOf('link') > -1;
      var link = outputData.get('link');
      var file = outputData.get('file');
      debugger;
      $('.panels').append('<div class="col-md-4">\
            <div class="panel">\
                <div class="panel-heading">\
                    ' + outputData.get('resource-name') + '\
                    <span id="remove_' + response.resource_added + '" class="glyphicon glyphicon-remove"></span>\
                </div>\
                <div class="panel-body">\
                    <div class="resource-description">\
                        ' + outputData.get('resource-desc') + '\
                    </div>\
                    <div class="resource-type">\
                        ' + (is_link ? 'url' : 'file') + '\
                    </div>\
                    <div class="resource-area">\
                        <a href="' + (is_link ? link : 'uni_files/' + file.name) + '" target="_blank">' + (is_link ? link : 'uni_files/' + file.name) + '</a>\
                    </div>\
                </div>\
            </div>\
        </div>');

      $('#resource_modal').modal('hide');
    }
  });
});
