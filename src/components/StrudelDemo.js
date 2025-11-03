import React, { useEffect, useRef, useState } from "react";
import { setupStrudel, Proc, ProcAndPlay, handlePlay, handleStop, setPlaybackSpeed } from "./StrudelSetup";
import { stranger_tune } from "../tunes";

import ControlButtons from "./ControlButtons";
import OptionButtons from "./OptionButtons";
import TextEditor from "./TextEditor";

import D3Graph from "./D3Graph";

function StrudelDemo() {
    const hasRun = useRef(false);
    const [procText, setProcText] = useState("");
    // Processing options
    const [option, setOption] = useState("on");
    // Selected instrument
    const [instrument, setInstrument] = useState("all");

    // Data for d3 graph
    const [graphData, setGraphData] = useState([]);
    // Track whether it is playing
    const [isPlaying, setIsPlaying] = useState(false); 
    // Stores interval reference for graph animation
    const graphIntervalRef = useRef(null);

    // Animates graph while music is playing
    const startGraphAnimation = () => {
        if (graphIntervalRef.current) clearInterval(graphIntervalRef.current);
        let frame = 0;
        graphIntervalRef.current = setInterval(() => {
            const dynamicData = Array.from({ length: 30 }, (_, i) => ({
                note: i,
                // Generates wave-like data
                count: 20 + Math.abs(Math.sin(frame / 5 + i / 3)) * 60,
            }));
            setGraphData(dynamicData);
            frame++;
        }, 100);
    };

    // Generates a static graph based on text pattern frequency
    const generateStaticGraph = () => {
        const text = document.getElementById("proc")?.value || "";
        const counts = {};
        for (let char of text) {
            if (char.trim() !== "") counts[char] = (counts[char] || 0) + 1;
        }
        const formattedData = Object.entries(counts).map(([note, count]) => ({
            note,
            count,
        }));
        setGraphData(formattedData);
    };


    //const handleProcess = () => {
    //    Proc();
    //    const text = document.getElementById("proc")?.value || "";
    //    const counts = {};
    //    for (let char of text) {
    //        if (char.trim() !== "") counts[char] = (counts[char] || 0) + 1;
    //    }
    //    const formattedData = Object.entries(counts).map(([note, count]) => ({
    //        note,
    //        count,
    //    }));
    //    setGraphData(formattedData);
    //};

    const handleProcess = () => {
        Proc();
        setIsPlaying(false); 
        // Update static graph after processing
        generateStaticGraph();    
    };


    //const handleProcAndPlay = () => ProcAndPlay(instrument);

    const handleProcAndPlay = () => {
        setPlaybackSpeed(window.currentPlaybackSpeed || 1.0, setProcText); 
        ProcAndPlay(instrument);
        setIsPlaying(true);      
        startGraphAnimation();    
    };

    const handleStopMusic = () => {
        handleStop();
        setIsPlaying(false);
        if (graphIntervalRef.current) clearInterval(graphIntervalRef.current);
        generateStaticGraph();
    };

    // Run Strudel setup only one time when the page loads
    useEffect(() => {
        if (!hasRun.current) {
            hasRun.current = true;
            setupStrudel(stranger_tune, setProcText);
        }
    }, []);
   
    return (
        <div className="min-h-screen text-gray-200" style={{ backgroundColor: '#1c1c1f' }}>
            <header className="bg-indigo-600 py-4 shadow">
                <div className="container-fluid text-center">
                    <h2 className="header-title">Strudel Demo</h2>
                </div>
            </header>

            <main className="py-5" style={{ backgroundColor: "#1c1c1f" }}>
                <div className="container-fluid px-5">
                    <div className="row g-4 mb-4">
                        <div className="col-lg-7 d-flex flex-column gap-4">
                            <TextEditor procText={procText} setProcText={setProcText} />

                            <div className="card shadow-sm rounded-4 p-3" style={{ backgroundColor: '#1c1c1f' }}>
                                <h5 className="fw-bold mb-3" style={{ color: '#a3a3ff' }}> Pattern Editor </h5>
                                <div id="editor" className="border rounded-3 p-3 mb-3" style={{minHeight: "160px", borderColor: "#dee2e6", backgroundColor: "#fff", }}></div>
                            </div>
                        </div>

                        <div className="col-lg-5 d-flex flex-column gap-4">
                            <ControlButtons onProcess={handleProcess} onProcessAndPlay={handleProcAndPlay} onPlay={() => { handlePlay(); setIsPlaying(true); startGraphAnimation(); }} onStop={handleStopMusic} instrument={instrument} option={option} setInstrument={setInstrument} setOption={setOption} setProcText={setProcText} />

                            <OptionButtons option={option} setOption={setOption} ProcAndPlay={ProcAndPlay} instrument={instrument} setInstrument={setInstrument} />

                            <div className="card shadow-sm rounded-4 p-3" style={{ backgroundColor: '#1c1c1f' }}>
                                <h5 className="text-warning fw-bold mb-3">Graph Output</h5>
                                <D3Graph data={graphData} />
                            </div>

                            <div className="card shadow-sm rounded-4 p-3" style={{ backgroundColor: '#1c1c1f' }}>
                                <h5 className="text-info fw-bold mb-3">Canva</h5>
                                <canvas id="roll" className="w-100 mt-4" height="150"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="text-center text-muted py-4 border-top mt-5">
                <small style={{ color: '#ffffff' }}>Strudel Demo by Chehansa</small>
            </footer>
        </div>
    );
}

export default StrudelDemo;
