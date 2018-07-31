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
        if (map[190] && !map[16]) {
            changeCaracter('.')
            jugar()
        }
        if (map[190] && map[16]) {
            changeCaracter('>')             
        }
        if(!map[190] && !map[16]){
            perder()
        }
    }

    $('#slashdot').on( 'change keyup keydown paste cut', function (){
        $(this).height(0).height(this.scrollHeight);
    })

    $('#slashdot').val('Mantené apretado el punto.')

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
    if (NIVEL == 0) instrucciones.text('Mantené apretado el punto. No lo sueltes!')
    else if (NIVEL == 1) instrucciones.text('Tocá una vez shift.')
    else if (NIVEL == 2) instrucciones.text('Tocá pero un poquito más de tiempo shift.')
    else if (NIVEL == 3) instrucciones.text('Tocá pero un poquito mááás de tiempo shift.')
    else if (NIVEL == 4) {
        instrucciones.text('Seguí sumando puntos!!')
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
    else perder()
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
    changeCaracter('')
}

function subirNivel(){
    $("#puntosVal").text(NIVEL)
    NIVEL++
}

function agregarCaracter(){
    var input = $("#slashdot").val()
    input+=CARACTER
    $("#slashdot").val(input)
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