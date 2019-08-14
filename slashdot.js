var DATOSAPI = "https://spreadsheets.google.com/feeds/list/1EHx5zeOUugQLdqfljgS8-iUexkstF9RvMQZ09qUBpjk/od6/public/values?alt=json"
var FORMAPI = 'https://docs.google.com/forms/u/0/d/1GXj0U24BYcwkG7CaGVJsLUbRFujoEOmmPAQwVPCD_Q4'

var UPDATEDELAY = 5000 // Milisegundos que tarda en actualizar la tabla una vez logrado un record
var TUTORIAL = true
var AVAILABLECHARS = new RegExp("^[\\.\>]*$") // Solo '>' y '.', obviamente
var CARACTER = ''
var NIVEL = 0
var SPEED = 30

$(document).ready(function(){
    clearGame()
    updateTable()
    writeInstructions()
    window.setInterval(agregarCaracter, SPEED)

    var map = {}; // You could also use an array
    onkeydown = onkeyup = function(e){
        e = e || event; // to deal with IE
        map[e.keyCode] = e.type == 'keydown';
        if (map[190] && !map[17]) {
            changeCaracter('.')
            jugar()
        }
        if (map[190] && map[17]) {
            changeCaracter('>')             
        }
        if(!map[190] && !map[17]){
            perder()
            changeCaracter('')
        }
    }

    $('#slashdot').bind('input propertychange', function() {
        validarCaracteres()
    })
    
    $('#slashdot').bind('copy paste cut',function(e) {
        e.preventDefault()
    })

    $('#slashdot').bind("keydown", function (event) {
        if(event.keyCode == 8) { //8 == backspace
            perder()
        }
    })

    $('#slashdot').blur(function() {
        perder()
    })
})

function writeInstructions() {
    if (!TUTORIAL) return
    var instrucciones = $("#instrucciones")
    if (NIVEL == 0) instrucciones.html('Mantené apretado el punto <br> No lo sueltes nunca!')
    else if (NIVEL == 1) instrucciones.html('Apretá una sola vez y soltá lo más rápido que puedas la tecla ctrl <br> Tenés que lograr este patron: .....>.....')
    else if (NIVEL == 2) instrucciones.html('Tenés un punto!! <br> Ahora hacé lo mismo, pero dibuja ...>....>>.....')
    else if (NIVEL == 3) instrucciones.html('Tenés dos puntos!! <br>...>....>>....>>>....')
    else if (NIVEL == 4) instrucciones.html('Seguí sumando puntos!!')
    else if (NIVEL == 5) {
        instrucciones.html ('...>......>>.......>>>......>>>>......>>>>>......')
        TUTORIAL = false
    }
}

function jugar(){
    var input = $("#slashdot").val()
    var inputPicos = input.replace(/\./g,'')
    var inputSumatoria = inputPicos.length
    if (inputSumatoria == getSum(NIVEL)) {
        subirNivel()
        writeInstructions()
    }
    else if (inputSumatoria == getSum(NIVEL-1)) return
    else {
        perder()
        changeCaracter('.')
        jugar()
    }
}

function perder(){
    var recordAnt = $("#recordVal").text()
    var recordAct = NIVEL-1
    if (recordAct > recordAnt){
        $("#recordVal").text(recordAct)
    }
    NIVEL = 0
    clearGame()
    $("#puntosVal").text(0)
    
    if (recordAct > $('#puntos3').html()){
        postearRecord(recordAct.toString())
    }
    writeInstructions()
}

function subirNivel(){
    $("#puntosVal").text(NIVEL)
    NIVEL++
}

function agregarCaracter(){
    var input = $("#slashdot").val()
    input+=CARACTER
    $("#slashdot").val(input)
    if (CARACTER && $("#slashdot").outerHeight() < $("#slashdot")[0].scrollHeight ) {
        $("#slashdot").outerHeight($("#slashdot")[0].scrollHeight + parseFloat($('#slashdot').css('line-height'))-1)
    }
}

function changeCaracter(char){
    CARACTER=char
}

function validarCaracteres(){
    var input = $("#slashdot").val()
    $("#slashdot").val(input.replace(/\:/g, ">"))
    if (!AVAILABLECHARS.test(input)){
        perder()
    }
}
//// TABLA DE RECORDS
function postearRecord(record){
    var nombre = prompt("Felicitaciones!! Entraste al Top 3 del mundo de Slashdot! \n Por favor escribi tu nombre")
    if (!nombre) return
    var form = $("<form id='formRecord' type='hidden' action=" + FORMAPI + " onsubmit='return window.submitGoogleForm(this)'></form>")
    form.append("<input name='entry.1390684760' value=" + nombre + ">")
    form.append("<input name='entry.227954217' value=" + record + ">")
    form.submit()
    updateTableWrapper()
}

async function updateTableWrapper(){
    await new Promise(resolve => setTimeout(resolve, UPDATEDELAY))
    updateTable()
}

function updateTable(){
    $.ajax({
        url: DATOSAPI,
        method: 'GET',
        success: function(data) {
            populateTable(data)
        }
    })
}

function populateTable(api){
    var data = api.feed.entry
    var tbody = $("#TablaRecords")
    var count = 1
    data.forEach(jugador => {
        var nombre = jugador.gsx$nombre.$t
        var puntos = jugador.gsx$puntos.$t
        var nombreAct = $('#nombre'+count)
        var puntosAct = $('#puntos'+count)
        nombreAct.text(nombre)
        puntosAct.text(puntos)
        count++
    })
}
//// FUNCIONES AUXILIARES
function getSum(x){
    if (x == -1) return 0
    var sum = 0
    for(i = 0; i<=x;i++){
        sum+=i
    }
    return sum
}

function clearGame() {
    $("#slashdot").val('')
}
