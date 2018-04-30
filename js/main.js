$(document).ready(function () {
    $('.card-flip').click(function () {
        $(this).find('.card').toggleClass('flipped');
        return false;
    });
});