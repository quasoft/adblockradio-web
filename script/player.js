var currentStationIdx = -1;
var currentTitle = "";
var isPlaying = false;

function getBodyEl() {
    return document.getElementsByTagName('body')[0];
}

function getAudioEl() {
    return document.getElementById('audio');
}

function getTitleEl() {
    return document.getElementById('title');
}

function getStationEl() {
    return document.getElementById('station');
}

function getControlsEl() {
    return document.getElementById('controls');
}

function initPlayer() {
    var audio = getAudioEl();
    if (audio.addEventListener) {
        audio.addEventListener('loadedmetadata', onMetadata, false);
    }
}

function play() {
    if (currentStationIdx < 0) {
        currentStationIdx = getRandomStation();
    }
    var audio = getAudioEl();
    audio.src = stations[currentStationIdx].url;
    audio.load();
    audio.play();

    isPlaying = true;
    updateUIState();
    updateUIStation();
}

function pause() {
    var audio = getAudioEl();
    audio.pause();

    isPlaying = false;
    updateUIState();
}

function onMetadata() {
    var meta = audio.mozGetMetadata();
    console.log('Metadata received: ', meta);
    
    if (meta.hasOwnProperty('title')) {
        var title = meta['title'];
        if (isBlacklisted(title)) {
            changeStation();
        } else {
            if (currentTitle != title) {
                currentTitle = title
                updateUITitle(true);
            }
        }
    }
}

function updateUITitle(changed) {
    var titleEl = getTitleEl();
    titleEl.innerHTML = currentTitle;
    
    if (changed) {
        title = getTitleEl();
        title.classList.add('pulse');
    }
}

function updateUIStation() {
    var stationEl = getStationEl();
    var stationName = ""
    if (currentStationIdx >= 0) {
        stationName = stations[currentStationIdx].name;
    }

    stationEl.innerHTML = stationName;
}

function updateUIState() {
    var body = getBodyEl();
    if (isPlaying) {
        body.classList.add('is-playing');
    } else {
        body.classList.remove('is-playing');
    }
    console.log("State: ", isPlaying);
}

function isBlacklisted(title) {
    var i;
    var re;
    for (i = 0; i < blacklist.length; i++) {
        re = new RegExp(blacklist[i]);
        if (re.test(title)) {
            console.log("Commercial detected in ", title, " with pattern ", blacklist[i])
            return true;
        }
    }
    return false;
}

function getRandomStation() {
    var idx;
    while (true) {
        idx = Math.floor(Math.random()*stations.length);
        if (idx != currentStationIdx) {
            return idx
        }
    }
}

function changeStation() {
    currentStationIdx = getRandomStation();
    console.log("Changing station")
    pause();
    play();
}

if (window.addEventListener) {
    document.addEventListener("DOMContentLoaded", function(event) {
        initPlayer();
        play();
    });
}