var AVAILABLECHARS = new RegExp("^[\\.\>]*$")

var sumatoria = 0
var sumatoriaAnt = 0
var nivel = 0

var DATOSAPI = "https://sheetsu.com/apis/v1.0su/5fa3298102ba" 

$(document).ready(function(){
    $("#slashdot").val('');
    updateTable();

    function updateTable(){
        var tbody = $("#Top3")
        tbody.empty()
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
            var iniciales = jugador.nombre
            var puntos = jugador.puntos
            var row = "<tr class='table-light'>" + 
                "<td> #" + count + "</td>" +
                "<td>" + iniciales + "</td>" +
                "<td id='puntos" + count + "'>" + puntos + "</td>" +
                "</tr>";
            tbody.append(row)
            count++
        });
    }
    
    function postearRecord(record){
        var nombre = prompt("Felicitaciones!! Entraste al Top 3 del mundo de Slashdot! \n Por favor escribi tu nombre");
        if (!nombre) return
        var form = $("<form id='formRecord' type='hidden' action='https://docs.google.com/forms/u/0/d/1GXj0U24BYcwkG7CaGVJsLUbRFujoEOmmPAQwVPCD_Q4' " +
        "onsubmit='return window.submitGoogleForm(this);'></form>");
        form.append("<input name='entry.1390684760' value=" + nombre + ">");
        form.append("<input name='entry.227954217' value=" + record + ">");
        form.submit()
        updateTableWrapper()
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
        sumatoria = 0
        nivel = 0
        sumatoriaAnt = 0
        $("#slashdot").val('')
        $("#puntosVal").text(0)
        
        if (recordAct > $('#puntos3').html()){
            postearRecord(recordAct.toString())
        }
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
        if(event.keyCode == 8) {
            perder();
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


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function updateTableWrapper(){
        await sleep(10000)
        updateTable()
    }
});
