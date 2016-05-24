var currCircle = 1
var currBar = 0
var currPage = 1;

mapp_nums = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  5: 'fifth'
};

function format_form_header() {
  var width = 100 / num_bars;
  $('.bar').width(width + '%');
  for (var i = 0; i < num_cats; i++) {
    var circle = '.circle' + (i + 1);
    var cat_text = '.under-text' + i;
    if (i == 0) {
      $(circle).css('left', '-5px');
      $(cat_text).css('left', '-20px');
    } else if (i == num_cats - 1) {
      $(circle).css('right', '-5px');
      $(cat_text).css('right', '-20px');
    } else {
      var circle_percent = (width * i) - 1 + '%';
      var cat_percent = (width * i) - 2 + '%';
      $(circle).css('left', circle_percent);
      $(cat_text).css('left', cat_percent);
    }
  }
}

$(document).ready(function() {
  format_form_header();

  $('.next-btn').click(function () {
    if (currCircle == num_cats + 1) return;

    // fill previous circle
    $('.circle' + currCircle).removeClass('half-empty').addClass('filled');

    // half-empty next circle
    currCircle += 1;
    if (currCircle == num_cats) {
      $('.next-btn-container').hide();
      $('.submit-btn-container').show();
    };
    $('.circle' + currCircle).addClass('half-empty');
    $('.collapsing-row.active').removeClass('active');
    $('.collapsing-row.form-row' + (currCircle - 1)).addClass('active');

    // fill prev bar
    currBar += 1;
    $('.bar' + currBar).addClass('filled');
  });

  $('.prev-btn').click(function () {
    if (currCircle == 1) return;

    if (currCircle == num_cats) {
      $('.next-btn-container').show();
      $('.submit-btn-container').hide();
    };

    // clear previous circle
    $('.circle' + currCircle).removeClass('half-empty')

    // half empty next circle
    currCircle -= 1
    if (currCircle == 0) return;
    $('.circle' + currCircle).removeClass('filled').addClass('half-empty');
    $('.collapsing-row.active').removeClass('active');
    $('.collapsing-row.form-row' + (currCircle - 1)).addClass('active');

    if (currCircle == num_cats) return;
    // clear previous bar
    $('.bar' + currBar).removeClass('filled');
    currBar -= 1;
  });

  $('.panel-title > a').click(function() {
    if ($(this).parent().parent().hasClass('active')) {

      // change circle on panel heading
      var handle = $(this).parent().parent().parent();
      handle.find('.select-circle').removeClass('glyphicon-ok-sign');
      if (handle.find('.subcat-desc').val() !== '')
        handle.find('.select-circle').addClass('glyphicon-ok');
      else handle.find('.select-circle').addClass('glyphicon-record');

      // remove all down arrows
      $('.down-arrow').css('opacity', 0);

      // remove active panel
      $('.panel-heading.active').removeClass('active');
      return;
    }
    // remove all down arrows and add in this one
    $('.down-arrow').css('opacity', 0);
    $(this).parent().parent().parent().find('.down-arrow').css('opacity', 1);

    // remove all active panels and make this one active
    $('.panel-heading').removeClass('active');
    $(this).parent().parent().addClass('active');

    // close all active panels and open this one
    var all_collapsibles = $('.panel-collapse').filter(function (i, val) {
      return !($(val).hasClass('active'));
    });
    all_collapsibles.collapse('hide');
    $('.panel-collapse.active').collapse('show');

    // remove all ok signs and change to record sign
    var handle = $('.glyphicon-ok-sign');
    handle.removeClass('glyphicon-ok-sign');
    if (handle.parent().parent().parent().siblings('.panel-collapse').find('.subcat-desc').val() !== '')
      handle.addClass('glyphicon-ok');
    else handle.addClass('glyphicon-record')

    // remove active record sign and change to ok sign
    handle = $(this).children('.select-circle');
    handle.removeClass('glyphicon-record').removeClass('glyphicon-ok');
    handle.addClass('glyphicon-ok-sign');
  });

  $('.row-bar').click(function (e) {
    if ($(e.target).hasClass('circle')) {
      var clicked_cir = $(e.target).data('num');

      if (clicked_cir > currCircle) {
        // fill previous circles
        for (var i = currCircle - 1; i < clicked_cir; i++) {
          $('.circle' + i).removeClass('half-empty').addClass('filled');
        }

        // half-empty next circle
        currCircle = clicked_cir;
        if (currCircle == num_cats) {
          $('.next-btn-container').hide();
          $('.submit-btn-container').show();
        }
        $('.circle' + currCircle).addClass('half-empty');
        $('.collapsing-row.active').removeClass('active');
        $('.collapsing-row.form-row' + (currCircle - 1)).addClass('active');

        // fill prev bars
        for (var i = currBar; i < clicked_cir; i++) {
          $('.bar' + i).addClass('filled');
        }

        currBar = currCircle - 1;
      } else if (clicked_cir < currCircle) {
        if (currCircle == num_cats) {
          $('.next-btn-container').show();
          $('.submit-btn-container').hide();
        };

        // clear previous circle
        for (var i = currCircle; i > clicked_cir; i--) {
          $('.circle' + i).removeClass('half-empty').removeClass('filled');
        }

        // half empty next circle
        currCircle = clicked_cir;
        $('.circle' + currCircle).removeClass('filled').addClass('half-empty');

        $('.collapsing-row.active').removeClass('active');
        $('.collapsing-row.form-row' + (currCircle - 1)).addClass('active');

        // clear previous bar
        for (var i = currBar; i > clicked_cir - 1; i--) {
          $('.bar' + i).removeClass('filled');
        }
        currBar = currCircle - 1;
      }
    }
  });
});
