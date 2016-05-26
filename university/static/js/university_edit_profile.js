
var csrftoken;

$(document).ready(function() {
    var u_id = $("#uni-id-hidden").attr("data-id");
    var changed_positions = {};
    csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);

        return pattern.test(emailAddress);
    };

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.img-area').css('background-image', "url(" + e.target.result + ")");
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $(".upload-img-input").change(function(){
        readURL(this);
        $("#upload-photo-form").submit()
    });

    $(".edit-btn").click(function() {
        var change = $(this).attr("data-edit")
        $("#" + change + "-static").slideToggle();
        $("#" + change + "-edit").slideToggle()
    });

    $(".edit-submit").click(function() {
        var change = $(this).attr("data-edit");
        var data = {};
        var fields = "";
        $("." + change + "-input").each(function() {
            var field = $(this).attr("name");
            fields += field + ",";
            data[field] = $(this).val();
            $("#" + change + "-" + field).text(data[field]);
        })
        data["u_id"] = u_id
        data["fields"] = fields
        $.ajax({
            url : "/editmetadata",
            type: "POST",
            data : data,
            success: function(data, textStatus, jqXHR)
            {
                $("#" + change + "-static").slideDown();
                $("#" + change + "-edit").slideUp()
            },
            error: function (jqXHR, textStatus, errorThrown) {}
        });
    });

    $('#admin-edit, #collab-edit').click(function() {
        $('#admin_modal').modal('show');
    });

    $('#admin-submit').click(function () {
        var data = {};
        var admin_ordering = $('#admin-list').children().map(function (i,v) {
            return $(v).data('cu-id');
        }).toArray();
        var collab_ordering = $('#collab-list').children().map(function (i,v) {
            return $(v).data('cu-id');
        }).toArray();

        data['u_id'] = u_id;
        data['admin_ordering'] = admin_ordering;
        data['collab_ordering'] = collab_ordering;
        data['changed_positions'] = changed_positions;

        $.ajax({
            url: '/changeuniadmin',
            type: 'POST',
            data: data
        });

        $('#admin_modal').modal('hide');

        for (order in admin_ordering) {
            $('#admin-panel').append($('#admin' + admin_ordering[order]));
        }
        for (order in collab_ordering) {
            $('#collab-panel').append($('#admin' + collab_ordering[order]));
        }
    });

    $('.admin-list').sortable({
        connectWith: 'admin-edit',
        placeholder: '<li class="admin-placeholder"></li>'
    });

    $('.admin-list').click(function (e) {
        if ($(e.target).hasClass('glyphicon-remove')) {
            var target_admin = $(e.target).parent();

            data = {};

            data['cu_id'] = $(target_admin).data('cu-id')

            $.ajax({
                url: '/removeuniadmin',
                type: 'POST',
                data: data
            });

            $(target_admin).remove();
            $('#admin' + data['cu_id']).remove();
        }

        if ($(e.target).hasClass('admin-position')) {
            $(e.target).blur(function() {
                var cu_id = $($(e.target).parent()).data('cu-id');

                $('#admin' + cu_id).children('.admin-position').text($(e.target).text());

                changed_positions[cu_id] = $(e.target).text();
            });

            $(e.target).keydown(function (ev) {
                if (ev.keyCode == 13 || ev.keyCode == 10) {
                    ev.preventDefault();
                    $(e.target).blur();
                }
            });
        }
    });

    $('#add-admin').click(function (e) {
        if (isValidEmailAddress($('#admin-email').val())) {
            var email = $('#admin-email').val();

            data = {
              'email': email,
              'u_id': u_id
            };

            $.ajax({
                url: '/adduniadmin',
                type: 'POST',
                data: data,
                success: function (resp) {
                    $('#collab-list').append(
                        '<li class="admin-box" data-cu-id="' + resp.cu_id + '">\
                            <span class="admin-name">' + resp.name + '</span>\
                            <span class="admin-position" contenteditable="true">' + resp.position + '</span>\
                            <span class="glyphicon glyphicon-remove"></span>\
                        </li>');
                    $('#collab-panel').append(
                        '<div id="admin' + resp.cu_id + '" class="admin-entry">\
                            <div class="admin-position">' + resp.position + '</div>\
                            <div class="admin-name">' + resp.name + '</div>\
                        </div>');

                    $('.admin-list').sortable();

                    $('#admin-email').val('');
                }
            });
        } else {
            $('.modal-footer').append(
              '<div id="email-alert" class="alert alert-warning alert-dismissible"\
              role="alert">Make sure you enter a valid email!</div>');

            $('#admin-email').change(function (e) {
                if (isValidEmailAddress($('#admin-email').val())) {
                    $('#email-alert').remove();
                }
            });
        }
    });
});
