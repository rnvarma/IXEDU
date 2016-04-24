
$(document).ready(function() {
    $(".university-panel").click(function() {
        var id = $(this).attr("data-id");
        window.location.href = "/uni/" + id;
    })
})
