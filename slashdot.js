var AVAILABLECHARS = new RegExp("^[\\.\>]*$")

var sumatoria = 0
var sumatoriaAnt = 0
var nivel = 0

var DATOSAPI = "https://spreadsheets.google.com/feeds/list/1EHx5zeOUugQLdqfljgS8-iUexkstF9RvMQZ09qUBpjk/od6/public/values?alt=json"
var UPDATEDELAY = 5000 // Milisegundos que tarda en actualizar la tabla una vez logrado un record

$(document).ready(function(){
    clearGame()
    updateTable();
    checkOS();

    $('#slashdot').bind("keydown", function (event) {
        if (event.keyCode == 190 && !event.shiftKey) { //190 == punto (.)
            jugar()
        }
        if(event.keyCode == 8) {
            perder();
        }
    });
    
    $('#slashdot').bind("keyup", function (event) {
        if (event.keyCode == 190) {
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

function clearGame() {
    $("#slashdot").val('');
}

function checkOS() {
    if (!isLinux()){
        var input = $("#slashdot")
        input.prop('disabled', true);
        input.val('Este juego solo esta disponible en Linux. \n\nPerdón :(')
    }
}

function updateTable(){
    $.ajax({
        url: DATOSAPI,
        method: 'GET',
        success: function(data) {
            populateTable(data)
        }
    })
};

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
    clearGame()
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




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateTableWrapper(){
    await sleep(UPDATEDELAY)
    updateTable()
}

function isLinux() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
      return true;
    }
    return false;
  }