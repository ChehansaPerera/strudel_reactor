import './App.css';
import { useEffect, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export function SetupButtons() {

    document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
    document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
    document.getElementById('process').addEventListener('click', () => {
        Proc()
    }
    )
    document.getElementById('process_play').addEventListener('click', () => {
        if (globalEditor != null) {
            Proc()
            globalEditor.evaluate()
        }
    }
    )
}

export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started === true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

export function Proc() {

    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    ProcessText(proc_text);
    globalEditor.setCode(proc_text_replaced)
}

export function ProcessText(match, ...args) {

    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}

export default function StrudelDemo() {

    const hasRun = useRef(false);

    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });

            document.getElementById('proc').value = stranger_tune
            SetupButtons()
            Proc()
        }

    }, []);


return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-indigo-600 py-4 shadow">
            <div className="container-fluid text-center">
                <h2>Strudel Demo</h2>
            </div>
        </header>

        <main>
            <div className="container-fluid my-5">
                <div className="row g-4">
                    <div className="col-md-8">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label fw-semibold text-indigo-700">Text to preprocess:</label>
                        <textarea className="form-control border border-gray-300 rounded-2" rows="15" id="proc" ></textarea>
                    </div>

                    <div className="col-md-4 d-flex flex-column justify-content-between">
                        <nav className="bg-white shadow-sm rounded-3 p-3 text-center">
                            <h5 className="text-indigo-700 fw-semibold mb-3">Controls</h5>
                            <div className="d-grid gap-2">
                                <button id="process" className="btn btn-outline-primary">Preprocess</button>
                                <button id="process_play" className="btn btn-outline-primary">Proc & Play</button>
                                <button id="play" className="btn btn-success">Play</button>
                                <button id="stop" className="btn btn-danger">Stop</button>
                            </div>
                        </nav>
                    </div>
                </div>
                <div className="row mt-5 g-4">
                    <div className="col-md-8">
                        <h5 className="text-indigo-700 fw-semibold mb-3">Pattern Editor</h5>
                        <div id="editor" className="border border-gray-200 rounded-2 p-2 mb-3" />
                        <div id="output" className="border border-gray-100 rounded-2 p-2 bg-gray-50" />
                    </div>
                    <div className="col-md-4">
                        <div className="bg-white shadow-sm rounded-3 p-3">
                            <h5 className="text-indigo-700 fw-semibold mb-3">Processing Options</h5>

                            <div className="form-check mb-2">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={ProcAndPlay} defaultChecked />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    p1: ON
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={ProcAndPlay} />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    p1: HUSH
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <canvas id="roll"></canvas>
        </main >

        <footer className="text-center text-muted py-4 border-top mt-5">
            <small>Strudel Demo by Chehansa</small>
        </footer>
    </div >
);

}