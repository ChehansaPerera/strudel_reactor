# Strudel Demo - React Web Application

This project is a React-based web application that allows users to process and play musical patterns using Strudel.cc code. It includes real-time visualisations, instrument selection, effects, and control management

## Controls Overview

### Control Panel

- Preprocess: Processes the code in the text editor and updates the graph visualisation. Does not play the music
- Proc and Play: Preprocesses the current code, applies selected effects, and plays the music. Visualises a dynamic graph while playing
- Play: Plays the current code without preprocessing. Graph animation also starts
- Stop: Stops the music and stops the dynamic graph animation. The static graph is updated to reflect the processed pattern
- Dowload Json: Saves the current control settings (volume, speed, selected instrument, and option) as a Json file
- Uplaod Json: Loads previously saved control settings from a Json file

### Volume Slider

- Adjusts the global playback volume from 0% to 100%
- Changes take effect immediately while playing

### Speed Input

- Adjusts the playback speed (BPM multiplier) between 0.5x and 2x
- The code’s setcps() line is updated automatically when changed
- Maximum safe playback speed is 2x, minimum is 0.5x

## Options Panel
- Processing Options
	- ON: Default mode, normal playback
	- HUSH: Mutes the main arp section dynamically during processing

- Instrument Selection
	- All: Plays all instruments
	- Bass: Plays only the bassline
	- Synth: Plays only the main arp synth
	- Drum: Plays only drum lines

- Effects Accordion (Toggle with Show/Hide Effects)
	- Filter Sweep (LPF): Low-pass filter frequency
	- Reverb Depth: Adds spatial echo/reverb
	- Auto Pan: Stereo panning of sound automatically
	- (Effects are applied live when Proc and Play or Play button is clicked)

## D3Graph Visualisation

- Dynamic D3Graph: Animated waveform displayed while music is playing
- Static D3Graph: Shows the frequency of characters/notes in the Strudel code after preprocessing

## Text Editor

- Main area for entering or editing Strudel.cc code patterns
- Updates are immediately reflected after Preprocess button is clciked

## Usage Guidelines

- Dynamic D3Graph animation is tied to the playback, stopping music will stops the animation
- Uploading JSON requires a file exported from the same project (controls_state.json). Invalid structures are rejected
- Effects only apply when music is played, toggling them without playing will not produce sound
- HUSH mode only affects the main_arp section
- Playback speed changes the setcps() value but may distort timing if set too high or too low

## Songs

- Currently, no new songs have been added
- Default song used: stranger_tune from ../tunes.js

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

Note: this is a one-way operation. Once you `eject`, you can't go back!