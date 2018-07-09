var currentStationIdx = -1;
var currentTitle = "";
var isPlaying = false;

function getBodyEl() {
    return document.getElementsByTagName('body')[0];
}

function getAudioEl() {
    return document.getElementById('audio');
}

function getReaderEl() {
    return document.getElementById('metareader');
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
    audio.addEventListener('loadedmetadata', onPlayerMetadata, false);
    audio.addEventListener('stalled', onStalled, false);
    audio.addEventListener('canplay', onCanPlay, false);

    if (supportsGetMetadata()) {
        setInterval(function() {
            if (isPlaying) {
                var reader = getReaderEl();
                reader.addEventListener('loadedmetadata', onReaderMetadata, false);
                reader.src = stations[currentStationIdx].url;
                reader.muted = true;
                reader.volume = 0;
                reader.pause();
                reader.load();
                reader.play();
                document.getElementById('audio').volume = 1;
            }
        }, 1000);
    }
}

function getMetadata(audio) {
    if (!supportsGetMetadata()) {
        return {};
    } else {
        return audio.mozGetMetadata();
    }
}

function play() {
    checkBrowserAndWarn();
    if (currentStationIdx < 0) {
        currentStationIdx = getRandomStation();
    }
    stopReader();
    var audio = getAudioEl();
    audio.src = stations[currentStationIdx].url;
    audio.load();
    audio.play();

    isPlaying = true;
    updateUIState();
    updateUIStation();
}

function pause() {
    stopReader();

    var audio = getAudioEl();
    audio.pause();

    isPlaying = false;
    updateUIState();
}

function stopReader() {
    getReaderEl().pause();
}

function onMetaObj(meta) {
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

function onPlayerMetadata() {
    var audio = getAudioEl();
    var meta = getMetadata(audio);
    console.log('Metadata received in player: ', meta);
    onMetaObj(meta);
}

function onReaderMetadata() {
    var reader = getReaderEl();
    var meta = getMetadata(reader);
    console.log('Metadata received in meta reader: ', meta);
    onMetaObj(meta);
    stopReader();
}

function onStalled() {
    console.log("Stalled");

    // The stalled event does not work in Edge browser, so ignore it
    if (navigator.userAgent.search("Edge") > -1) {
        return;
    }

    if (isPlaying) {
        var audio = getAudioEl();
        audio.load();
        audio.play();
    }
}

function onCanPlay() {
    console.log("Can play");
    if (isPlaying) {
        var audio = getAudioEl();
        audio.play();
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

function supportsGetMetadata() {
    var audio = getAudioEl();
    return typeof(audio.mozGetMetadata) !== 'undefined';
}

function checkBrowserAndWarn() {
    if (!supportsGetMetadata()) {
        var titleEl = getTitleEl();
        titleEl.innerHTML = "Ad detection works only in Firefox";
        titleEl.style = "border-color: red";
    }
}

if (window.addEventListener) {
    document.addEventListener("DOMContentLoaded", function(event) {
        initPlayer();
    });
}