var AVAILABLECHARS = new RegExp("^[\\.\>]*$")

var sumatoria = 0
var sumatoriaAnt = 0
var nivel = 0

var DATOSAPI = "https://sheetsu.com/apis/v1.0su/8c85cddd285f" 

$(document).ready(function(){
    $("#slashdot").val('');
    $('#inputRecord').hide()
    updateTable();

    function updateTable(){
        $.ajax({
            url: DATOSAPI,
            method: 'GET',
            success: function(data) {
                populateTable(data)
            }
        })
    };

    function populateTable(data){
       
        var top3 = data.slice(0,3)
        var tbody = $("#Top3")
        var count = 1
        top3.forEach(jugador => {
            var iniciales = jugador.inicialesSorted
            var puntos = jugador.puntosSorted
            var row = "<tr class='table-light'>" + 
                "<td> #" + count + "</td>" +
                "<td>" + iniciales + "</td>" +
                "<td id='puntos" + count + "'>" + puntos + "</td>" +
                "</tr>";
            tbody.append(row)
            count++
        });
    }

    function postearRecord(record, fecha){
        
        var iniciales = prompt("Felicitaciones!! Entraste al Top 3 del mundo de Slashdot! \n Por favor escribi tus iniciales");
        while (!iniciales || iniciales.length > 4){
            iniciales = prompt("Por favor ingresa hasta 4 letras")
        } 
        
        $.ajax({
            url: DATOSAPI,
            method: 'POST',
            data: {
                'iniciales': iniciales.toUpperCase(),
                'puntos': record,
                'fecha': fecha
            },
            success: function(data) {
                alert()
                updateTable()
            }
        })
    }

    function jugar(){
        var input = $("#slashdot").val()
        var inputPicos = input.replace(/\./g,'')
        var inputSumatoria = inputPicos.length
        if (inputSumatoria == sumatoria) {
            incrementar()
        }
        else if (inputSumatoria == sumatoriaAnt) return
        else  {
            perder()
        }
    }

    function perder(){
        var recordAnt = $("#recordVal").text()
        var recordAct = nivel-1
        if (recordAct > recordAnt){
            $("#recordVal").text(recordAct)
        }

        if (recordAct > $('#puntos3').html()){
            postearRecord(recordAct.toString(), new Date().toString())
        }
        sumatoria = 0
        nivel = 0
        sumatoriaAnt = 0
        $("#slashdot").val('')
        $("#puntosVal").text(0)
    }

    function incrementar(){
        if (sumatoria == 0){
            sumatoria = 1
        }
        else {
            $("#puntosVal").text(nivel)
            sumatoriaAnt = sumatoria
            sumatoria = sumatoria + (nivel+1)
        }
        nivel += 1
    }

    function latamToEng(){
        var input = $("#slashdot").val()
        $("#slashdot").val(input.replace(/\:/g, ">"))
    }

    function validarCaracteres(){
        var input = $("#slashdot").val()
        if (!AVAILABLECHARS.test(input)){
            perder()
        }
    }

    $('#slashdot').bind("keydown", function (event) {
        if (event.keyCode == 190 && !event.shiftKey) { //190 == punto (.)
            jugar()
        }
    });

    $('#slashdot').bind("keyup", function (event) {
        if (event.keyCode == 190 && !event.shiftKey) {
            perder()
        }
    });

    $('#slashdot').bind('input propertychange', function() {
        latamToEng()
        validarCaracteres()
    });

    $('#slashdot').bind('copy paste cut',function(e) {
        e.preventDefault()
    });

});
