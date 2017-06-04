import React, {Component} from 'react';
import PropTypes from 'prop-types';
import WebMidi from 'webmidi';

import 'src/assets/stylesheets/base.scss';


class App extends Component {
    constructor(props) {
        super(props);


        this.state = {
            loading: true,
            midi: null,
            notes: {},
            channels: []
        }

    }


    componentWillMount() {

        let midi = WebMidi;
        midi.enable((err) => {
            if (err) {
                console.log("WebMidi could not be enabled.", err);
            } else {
                this.setState({
                    midi: midi
                });
                let inputs = this.state.midi.inputs;
                this.start(inputs);
            }


        });


    }

    componentWillReceiveProps(next) {

    }

    componentDidMount() {


    }

    note_on(e) {
        let notes = this.state.notes,
            channels = this.state.channels;


        let on = e.type == 'noteon';


        let channel = e.channel,
            num = e.note.number,
            note = e.note.name,
            octave = e.note.octave,
            vel = e.rawVelocity,
            stamp = e.timestamp;


        if (!channels.includes(channel)) {
            channels.push(channel)
            this.setState({channels: channels});
        }


        e.note.opacity = Math.ceil(e.velocity * 10) / 10;
        e.note.channel = e.channel;
        let index = note + octave;

        if (on) {
            notes[index] = e.note;
        } else {
            delete notes[index];

        }
        console.log(e)


        this.setState({notes: notes});


    }


    start(inputs) {

        inputs.forEach((input) => {
            input.addListener('noteon', "all", this.note_on.bind(this));
            input.addListener('noteoff', "all", this.note_on.bind(this));
            //  input.addListener('noteoff', "all", this.note_off.bind(this));
        });


    }

    render() {


        let midi = this.state.midi,
            inputslist, channels;

        if (midi) {
            let inputs = this.state.midi.inputs;

            //  inputslist = inputs.map((inp) => <li key={'input' + inp.id}>{inp.name}</li>);


            let notes = Object.values(this.state.notes);

            channels = this.state.channels.map(c => {

                let notes_by_channel = notes.filter(n => {
                    console.log(n, c)
                    return n.channel == c
                })
                    .map((note, i) => <li
                        key={'note_' + i}
                        style={{opacity: note.opacity}}>
                        {note.name + note.octave}
                    </li>);

                return (
                    <div className="channel_column">
                        <h1>{c}</h1>
                        <ul>{notes_by_channel}</ul>
                    </div>
                );

            });


        } else {
            //   inputslist = 'loading...';
            channels = 'loading...';
        }


        return (
            <div className="channel_columns">
                <h1>Channels</h1>
                {channels}
            </div>

        );
    }
}

App.propTypes = {
    name: PropTypes.string,
};

export default App;
