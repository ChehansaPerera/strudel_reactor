import React, { useEffect, useRef, useState } from "react";
import {setupStrudel,Proc,ProcAndPlay,handlePlay,handleStop,} from "./StrudelSetup";
import { stranger_tune } from "../tunes";

import ControlButtons from "./ControlButtons";
import OptionButtons from "./OptionButtons";
import TextEditor from "./TextEditor";

function StrudelDemo() {
    const hasRun = useRef(false);
    const [procText, setProcText] = useState("");
    const [option, setOption] = useState("on");

    const handleProcess = () => Proc();
    const handleProcAndPlay = () => ProcAndPlay();

    useEffect(() => {
        if (!hasRun.current) {
            hasRun.current = true;
            setupStrudel(stranger_tune, setProcText);
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
                        <TextEditor procText={procText} setProcText={setProcText} />
                        <ControlButtons onProcess={handleProcess} onProcessAndPlay={handleProcAndPlay} onPlay={handlePlay} onStop={handleStop} />
                    </div>

                    <div className="row mt-5 g-4">
                        <div className="col-md-8">
                            <h5 className="text-indigo-700 fw-semibold mb-3">Pattern Editor</h5>
                            <div id="editor" className="border border-gray-200 rounded-2 p-2 mb-3" />
                            <div id="output" className="border border-gray-100 rounded-2 p-2 bg-gray-50" />
                        </div>
                        <OptionButtons option={option} setOption={setOption} ProcAndPlay={ProcAndPlay} />
                    </div>
                </div>

                <canvas id="roll" className="w-100 mt-4" height="300"></canvas>
            </main>

            <footer className="text-center text-muted py-4 border-top mt-5">
                <small>Strudel Demo by Chehansa</small>
            </footer>
        </div>
    );
}

export default StrudelDemo;