var DATOSAPI = "https://spreadsheets.google.com/feeds/list/1EHx5zeOUugQLdqfljgS8-iUexkstF9RvMQZ09qUBpjk/od6/public/values?alt=json"
var FORMAPI = 'https://docs.google.com/forms/u/0/d/1GXj0U24BYcwkG7CaGVJsLUbRFujoEOmmPAQwVPCD_Q4'
var UPDATEDELAY = 5000 // Milisegundos que tarda en actualizar la tabla una vez logrado un record
var AVAILABLECHARS = new RegExp("^[\\.\>]*$")
var NIVEL = 0
var SPEED = 40
var TUTORIAL = true
var OS = getOS()
var FIRSTTIME = true
var CARACTER = '.'


$(document).ready(function(){
    clearGame()
    updateTable()
    writeInstructions()
        
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

    if (OS == 'Linux'){
        $('#slashdot').bind("keyup", function (event) {
            if (event.keyCode == 190) {
                perder()
            }
        })
        $('#slashdot').bind("keydown", function (event) {
            if (event.keyCode == 190 && !event.shiftKey) { //190 == punto (.)
                jugar()
            }
        })
    }
    else {
        $('#slashdot').bind("keydown", function (event) {
            if (event.keyCode == 190 && !event.shiftKey) { //190 == punto (.)
                jugarWindows(FIRSTTIME)
            }
            if (event.keyCode == 16) {
                changeCaracter()
            }
        })
        $('#slashdot').bind("keyup", function (event) {
            if (event.keyCode == 16) {
                changeCaracter()
                jugar()
            }
        })    
    }
})

function writeInstructions() {
    if (!TUTORIAL) return
    var instrucciones = $("#instrucciones")
    if (NIVEL == 0){ 
        if (OS=='Linux') instrucciones.text('Mantené apretado el punto')
        else instrucciones.text('Mantené apretado el punto')
    }
    else if (NIVEL == 1) instrucciones.text('Tocá una vez shift')
    else if (NIVEL == 2) instrucciones.text('Tocá pero un poquito más de tiempo shift')
    else if (NIVEL == 3) instrucciones.text('Tocá pero un poquito mááás de tiempo shift')
    else if (NIVEL == 4) {
        instrucciones.text('Bienvenido al SlashDot!')
        TUTORIAL = false
    }
}

function changeCaracter(){
    if (CARACTER == '.') CARACTER='>'
    else if (CARACTER == '>') CARACTER='.'
}

function _agregarCaracter(){
    var input = $("#slashdot").val()
    input+=CARACTER
    $("#slashdot").val(input)
}

function agregarCaracteres() {
    window.setInterval(_agregarCaracter, SPEED)
}

function jugarWindows(firsttime){
    if(firsttime) {
        agregarCaracteres()
        firsttime = false
        jugar()
    }
}


function agregarPuntos() {
    window.setInterval(_agregarPuntos, 50)
}

function jugar(){
    var input = $("#slashdot").val()
    var inputPicos = input.replace(/\./g,'')
    var inputSumatoria = inputPicos.length
    if (inputSumatoria == getSum(NIVEL)) {
        incrementar()
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
}

function incrementar(){
    $("#puntosVal").text(NIVEL)
    NIVEL++
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
function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS'
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS'
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows'
    } else if (/Android/.test(userAgent)) {
      os = 'Android'
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux'
    }
    return os
}

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