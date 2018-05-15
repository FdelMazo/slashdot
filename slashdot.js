var AVAILABLECHARS = new RegExp("^[\\.\>]*$")

var sumatoria = 0;
var sumatoriaAnt = 0;
var nivel = 0;

$(document).ready(function(){     
    
    function jugar(){    
        var input = $("#slashdot").val();
        if (!AVAILABLECHARS.test(input)){
            perder();
        }    
        var inputPicos = input.replace(/\./g,'')
        var inputSumatoria = inputPicos.length;
        if (inputSumatoria == sumatoria) {
            incrementar()
        }
        else if (inputSumatoria == sumatoriaAnt) return;   
        else  {
            perder()
        }       
    }

    function perder(){
        $("#resultados").text("Perdiste :(");
        $("#slashdot").val('');
        sumatoria = 0
        nivel = 0
        sumatoriaAnt = 0
    }

    function incrementar(){
        if (sumatoria == 0){
            sumatoria = 1
        }
        else {
            $("#resultados").append("Punto!! - "+ nivel + "<br>");
            sumatoriaAnt = sumatoria
            sumatoria = sumatoria + (nivel+1)
        }
        nivel += 1;
    }

    var bool = true
    $(document).bind("keydown", function (event) {
        if (event.keyCode == 190 && !event.shiftKey) { //40 is the keyCode of down arrow key
            jugar()
        }
    });
    
});