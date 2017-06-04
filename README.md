# IAC MIDI / Node / React

Virtual MIDI bus: from Live to browser

#### Up and running:
Install:
```
$ yarn
```

Dev server (default: `http://localhost:8080/`):
```
$ yarn dev
```
 
AudioMIDISetup: 
```
AudioMIDISetup -> IAC -> Check : Device is online
```
Ableton Live:
```
Preferences -> Link MIDI -> Midi Ports -> [IAC port] output: ON
MIDI Track -> MIDI To [IAC port] -> set channel
```


#### Todo:

* Fancy animations for each channel (mo.js?)