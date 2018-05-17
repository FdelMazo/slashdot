var AVAILABLECHARS = new RegExp("^[\\.\>]*$")

var sumatoria = 0;
var sumatoriaAnt = 0;
var nivel = 0;

$(document).ready(function(){
    $("#slashdot").val('');

    function jugar(){
        var input = $("#slashdot").val();
        var inputPicos = input.replace(/\./g,'')
        var inputSumatoria = inputPicos.length;
        if (inputSumatoria == sumatoria) {
            incrementar();
            document.getElementById('count').innerHTML = nivel-1;
        }
        else if (inputSumatoria == sumatoriaAnt) return;
        else  {
            perder();
        }
    }

    function perder(){
        var recordAnt = $("#recordVal").text();
        var recordAct = nivel-1;
        if (recordAct > recordAnt){
            $("#recordVal").text(nivel -1);
        }
        sumatoria = 0
        nivel = 0
        sumatoriaAnt = 0
        $("#slashdot").val('');
        $("#puntosVal").text(0);
        document.getElementById('count').innerHTML = 0;

    }

    function incrementar(){
        if (sumatoria == 0){
            sumatoria = 1
        }
        else {
            $("#puntosVal").text(nivel);
            sumatoriaAnt = sumatoria
            sumatoria = sumatoria + (nivel+1)
        }
        nivel += 1;
    }

    function latamToEng(){
        var input = $("#slashdot").val();
        $("#slashdot").val(input.replace(/\:/g, ">"));
    }

    function validarCaracteres(){
        var input = $("#slashdot").val();
        if (!AVAILABLECHARS.test(input)){
            perder();
        }
    }

    $(document).bind("keydown", function (event) {
        if (event.keyCode == 190 && !event.shiftKey) { //190 == punto (.)
            jugar()
        }
    });

    $('#slashdot').bind('input propertychange', function() {
        latamToEng()
        validarCaracteres()
    });

    $(document).bind("keyup", function (event) {
        if (event.keyCode == 190 && !event.shiftKey) {
            perder()
        }
    });

});
