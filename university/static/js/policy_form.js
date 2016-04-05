var currCircle = 1
var currBar = 0
var currPage = 1;

mapp_nums = {
    1: "first",
    2: "second",
    3: "third",
    4: "fourth",
    5: "fifth"
}

function format_form_header() {
    var width = 100 / num_bars;
    $(".bar").width(width + "%");
    for (var i = 0; i < num_cats; i++) {
        var circle = ".circle" + (i + 1);
        var cat_text = ".under-text" + i;
        if (i == 0) {
            $(circle).css("left", "-5px");
            $(cat_text).css("left", "-20px");
        } else if (i == num_cats - 1) {
            $(circle).css("right", "-5px");
            $(cat_text).css("right", "-20px");
        } else {
            var circle_percent = (width * i) - 1 + "%";
            var cat_percent = (width * i) - 2 + "%";
            $(circle).css("left", circle_percent);
            $(cat_text).css("left", cat_percent);
        }
    }
}

$(document).ready(function() {
    format_form_header()
    $(".prev-btn").click(function () {
        if (currCircle == 1) return;

        if (currCircle == num_cats) {
            $(".next-btn-container").show()
            $(".submit-btn-container").hide();
        };

        // clear previous circle
        $(".circle" + currCircle).removeClass("half-empty")

        // half empty next circle
        currCircle -= 1
        if (currCircle == 0) return;
        console.log(currCircle)
        $(".circle" + currCircle).removeClass("filled").addClass("half-empty")
        $(".collapsing-row.active").removeClass("active");
        $(".collapsing-row.form-row" + (currCircle - 1)).addClass("active");

        if (currCircle == num_cats) return;
        // clear previous bar
        $(".bar" + currBar).removeClass("filled")
        currBar -= 1 

    })

    $(".next-btn").click(function () {

        if (currCircle == num_cats + 1) return;

        // fill previous circle
        $(".circle" + currCircle).removeClass("half-empty").addClass("filled")
        
        // half-empty next circle
        currCircle += 1
        if (currCircle == num_cats) {
            $(".next-btn-container").hide()
            $(".submit-btn-container").show();
        };
        $(".circle" + currCircle).addClass("half-empty")
        $(".collapsing-row.active").removeClass("active")
        $(".collapsing-row.form-row" + (currCircle - 1)).addClass("active")

        // fill prev bar
        currBar += 1
        $(".bar" + currBar).addClass("filled")
    })

    $(".panel-title > a").click(function() {
        if ($(this).parent().parent().hasClass("active")) {
            $(".panel-heading.active").children().children().children().removeClass("glyphicon-ok-sign").addClass("glyphicon-record");
            $(".panel-heading.active").removeClass("active");
            return;
        }
        $(".panel-heading.active").removeClass("active");
        $(this).parent().parent().addClass("active");
        $(".select-circle.glyphicon-ok-sign").removeClass("glyphicon-ok-sign").addClass("glyphicon-record");
        $(".panel-heading.active").children().children().children().removeClass("glyphicon-record").addClass("glyphicon-ok-sign");
    });




})