var repeticion = 1;
var incrementar = false;

$(document).ready(function(){     
    function testTextArea(){
        var input = $("#slashdot").val();
        var regex = getRegexp();
        if (regex.test(input)) {
            incrementar = true;
            $("#txtHere").append("Punto!<br>");
            $("#slashdot").val('');
        }
    }

    function getRegexp(){
        if (incrementar){
            repeticion +=1;
            incrementar = false;
        }
        var puntos = new RegExp("(\\.)+", "g");
        var picos = new RegExp("(\>){" + repeticion + "}", "g");
        var REGEXP = new RegExp(puntos.source + picos.source + puntos.source, "g");
        return REGEXP;
    }
    $("#slashdot").keydown(testTextArea);
});