
var csrftoken;

$(document).ready(function() {
    var u_id = $("#uni-id-hidden").attr("data-id");
    csrftoken = getCookie('csrftoken');

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
    })

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
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(data, textStatus, jqXHR)
            {
                $("#" + change + "-static").slideDown();
                $("#" + change + "-edit").slideUp()
            },
            error: function (jqXHR, textStatus, errorThrown) {}
        });
    })
})
