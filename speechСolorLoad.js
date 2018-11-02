const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const colors = {
    красный: 'red',
    оранжевый: 'orange',
    жёлтый: 'yellow',
    зелёный: 'green',
    голубой: 'blue',
    синий: 'darkblue',
    фиолетовый: 'violet',
    розовый: 'pink',
    серый: 'silver',
    золотой: 'gold'
};

const colorsList = Object.keys(colors);

const grammar =
    '#JSGF V1.0; grammar colors; public <color> = ' +
    colorsList.join(' | ') +
    ' ;';

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'ru-RU';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let diagnostic = document.querySelector('.output');
let bg = document.querySelector('html');

function getColor(speechResult) {
    for (let index = 0; index < colorsList.length; index += 1) {
        if (speechResult.indexOf(colorsList[index]) !== -1) {
            const colorKey = colorsList[index];
            return [colorKey, colors[colorKey]];
        }
    }
    return null;
}

document.body.onload = function () {
    recognition.start();
    console.log('Ready to receive a color command on load.');
}
document.onclick = function () {
    recognition.start();
    console.log('Ready to receive a color command on click.');
}
recognition.onresult = function (event) {
    try {
        const last = event.results.length - 1;
        const colors = getColor(event.results[last][0].transcript);

        diagnostic.textContent = 'Цвет страницы поменялся на: ' + colors[0];
        bg.style.backgroundColor = colors[1];
        console.log('Confidence: ' + event.results[0][0].confidence);
    } finally {
        setTimeout(() => {
            recognition.start();
            console.log('Ready to receive a color command.');
        }, 1000);
    }


}

recognition.onspeechend = function () {
    recognition.stop();
    console.log('onspeechend');
};

