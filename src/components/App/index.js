import React, {Component} from 'react';
import PropTypes from 'prop-types';
import WebMidi from 'webmidi';
import mojs from 'mo-js'
import 'src/assets/stylesheets/base.scss';
import anime from 'animejs';

const rand_pos = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const animations = {
    1: {
        name: 'burst',
        anim: (el, e) => {
            let velocity = e.velocity;
            let colors = [
                {'cyan': 'yellow'},
                {'red': 'green'},
                {'pink': 'yellow'},
                {'white': 'aqua'},
            ];


            el.tune({
                radius: {0: 300 * velocity},
                count: 7,
                x: rand_pos(-400, 200),
                y: rand_pos(-400, 200),
                angle: {0: 90},
                opacity: velocity,
                duration: 1000,
                children: {
                    fill: colors[0],
                    radius: 20 * velocity,
                }
            }).replay();
        }
    },
    2: {
        name: 'rect',
        anim: (el, e) => {
            el.classList.toggle('back');
        }
    }
}


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

        const burst = new mojs.Burst();
        const rect = document.getElementById('rect')


        this.setState(
            {
                burst: burst,
                rect: rect
            }
        )


    }


    note_on(e) {
        let notes = this.state.notes,
            channels = this.state.channels;


        let on = e.type == 'noteon';


        let channel = e.note.channel = e.channel,
            num = e.note.number,
            note = e.note.name,
            octave = e.note.octave,
            vel = e.rawVelocity,
            stamp = e.timestamp;

        let velocity = e.note.opacity = Math.ceil(e.velocity * 10) / 10;


        if (!channels.includes(channel)) {
            channels.push(channel)
            this.setState({channels: channels});
        }


        let index = note + octave;

        if (on) {

            notes[index] = e.note;

            let anim = animations[channel];

            let el = this.state[anim.name];

            console.log(anim, el)

            anim.anim(el, e)


        } else {
            delete notes[index];

        }


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

                    return n.channel == c
                })
                    .map((note, i) => <li
                        key={'note_' + i}
                        style={{opacity: note.opacity}}>
                        {note.name + note.octave}
                    </li>);

                return (
                    <div key={'channel_' + c} className="channel_column">
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
