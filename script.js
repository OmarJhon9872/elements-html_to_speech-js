var synth = null;

var lecturaAudioInnerText = document.querySelectorAll('.lecturaAudioInnerText');
var lecturaAudioAriaLabel = document.querySelectorAll('.lecturaAudioAriaLabel');
var lecturaAudioTitle = document.querySelectorAll('.lecturaAudioTitle');

var activarVoz = document.querySelector('.activarVoz');
var desactivarVoz = document.querySelector('.desactivarVoz');
var voices = [];

function verificaVocesLocal_Externa(voces, langDeseado, servicioLocal){
    return voces.filter(voice => voice.lang.toUpperCase() == langDeseado && voice.localService == servicioLocal).shift();
}

function populateVoiceList() {
    voices = synth.getVoices().filter(ssv => ssv.lang.toUpperCase() == 'ES-ES' || ssv.lang.toUpperCase() == 'ES-MX');
}

function speak(texto) {
    var vozAusar = '';
    vozAusar = verificaVocesLocal_Externa(voices, 'ES-ES', false);
    vozAusar = vozAusar == undefined ? verificaVocesLocal_Externa(voices, 'ES-MX', true) : vozAusar;
    vozAusar = vozAusar == undefined ? verificaVocesLocal_Externa(voices, 'ES-ES', true) : vozAusar;

    if (vozAusar == null) {
        alert('No hay paquetes de voz instalados o compatibles');
        return;
    }
    /*if (synth.speaking) {console.log('Aguanta');return;}*/
    var utterThis = new SpeechSynthesisUtterance(texto);

    utterThis.onerror = function (event) {
        console.error('Error al reproducir', event);
    }
    utterThis.voice = vozAusar;
    utterThis.pitch = 1;
    utterThis.rate = 1.2;
    synth.speak(utterThis);
}
activarVoz.addEventListener('click', function (){
    if(synth == null) {
        synth = window.speechSynthesis;
        populateVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
        }
    }
    document.getElementById('status').innerText = "Activado";
    var tipoElementos = [
        {'nombre': 'lecturaAudioInnerText', 'tipo': 'innerText'},
        {'nombre': 'lecturaAudioAriaLabel', 'tipo': 'ariaLabel'},
        {'nombre': 'lecturaAudioTitle',     'tipo': 'title'}
    ]

    tipoElementos.forEach(function (item){
        eval(item['nombre']).forEach(function(item2){
            item2.onmouseenter = function() {
                if(synth != null){
                    synth.cancel();
                    var dato = eval('item2.'+ item['tipo']);
                    speak(dato);
                }
            }
        });
    })
})

desactivarVoz.addEventListener('click', function (){
    document.getElementById('status').innerText = "Desactivado";
    synth = null;
})

