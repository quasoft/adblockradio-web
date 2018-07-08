# adblockradio-web

AdBlockRadio-Web is a web radio player that monitors the currently playing song via
audio tags and changes the radio station when a commercial starts.

Uses the `mozGetMetadata` method, so it currently works only in Firefox and only for OGG media.

## Disclaimer

*Works only in Firefox 45 or newer (both on desktop and mobile).*

*Other browsers (eg. IE, Edge, Chrome, Safari) are currently not supported, because of lack of `getMetadata` method on the `audio` object.*

[Live demo](https://quasoft.github.io/adblockradio-web/)

## How to install

1. Add OGG stream URLs for your favourite radio stations in the `stations` array inside `script/config.js`:

        var stations = [
            {"name": "User friendly name 1", "url": "http://URL_TO_OGG_STREAM1.ogg"},
            {"name": "User friendly name 2", "url": "http://URL_TO_OGG_STREAM2.ogg"}
        ];

2. Figure out what titles are being displayed by your radio stations during commercials, and add those as regex patterns in the `blacklist` array inside `script/config.js`:

        var blacklist = [
            ".*NAME OF RADIO STATION.*"
        ];

    Usually that's the name of the radio station.

3. Upload the whole folder to a static web server.

## TODO:

- [ ] Support Edge, Chrome and Safari browsers by manually fetching the audio stream in order to get the medata.
- [ ] Rewrite UI with React.
