/**
 * Created by Joshua on 11/6/2016.
 */

var numStr = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function convert(input) {
    return input.toLowerCase()
        .replace(/\s/g, "   ")
        .replace(/([a-z])/g, ":regional_indicator_$1: ")
        .replace(/([0-9])/g, function ($1) {
            return ":" + numStr[$1] + ": ";
        });
}


$(document).ready(function(){

    $('#in').on('change keyup paste', function (e) {
        $('#out').val(convert($("#in").val()));
    });

    $('#copy').click(function () {
        $('#out').select();
        document.execCommand('copy');
    });

});