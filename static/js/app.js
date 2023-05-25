
$(document).ready(function(){
    if ($(window).width() < 992) {
        $('#connect').html('Connect With Users');
        $('#users').removeClass('mx-3').addClass('mx-2 my-2');
    }
    else{
        $('#connect').html('');
        $('#users').addClass('mx-3').removeClass('mx-2 my-2');
    }
}
);

  