
$(document).ready(function() {
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
    });
})