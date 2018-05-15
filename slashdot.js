$(document).ready(function(){
    function myFunc(){
        var input = $("#slashdot").val();
        $("#txtHere").text(input);
    }
    myFunc();
    $("#slashdot").keyup(myFunc);
});