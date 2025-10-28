import { useState } from "react";
import { setGlobalVolume, setPlaybackSpeed } from "./StrudelSetup";
function ControlButtons({ onPlay, onStop, onProcess, onProcessAndPlay }) 
{
    const [volume, setVolume] = useState(0.8);
    const [speed, setSpeed] = useState(1.0);

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setGlobalVolume(newVolume); 
    };

    const handleSpeedChange = (e) => {
        let newSpeed = parseFloat(e.target.value);
        if (newSpeed < 0.5) newSpeed = 0.5;
        if (newSpeed > 2) newSpeed = 2;
        setSpeed(newSpeed);
        setPlaybackSpeed(newSpeed);
    };

    return (
        <nav className="bg-white shadow-sm rounded-3 p-3 text-center">
            <h5 className="text-primary fw-bold mb-3">Controls</h5>

            <div className="d-flex justify-content-center align-items-center gap-4 fs-3">
                <i id="process" className="bi bi-arrow-clockwise icon-btn" onClick={onProcess} title="Preprocess"></i>
                <i id="process_play" className="bi bi-play-circle-fill icon-btn" onClick={onProcessAndPlay} title="Proc and Play"></i>
                <i id="play" className="bi bi-play-fill icon-btn" onClick={onPlay} title="Play"></i>
                <i id="stop" className="bi bi-stop-fill icon-btn" onClick={onStop} title="Stop"></i>
            </div>

            <div className="px-4 py-2 bg-white rounded-3 shadow-sm d-flex flex-column">
                <label htmlFor="volumeSlider" className="form-label fw-semibold text-secondary mb-1">Volume: {(volume * 100).toFixed(0)}%
                </label>
                <input type="range" className="form-range" id="volumeSlider" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} style={{accentColor: "#4f46e5", cursor: "pointer",}}/>
            </div>

            <div className="d-flex justify-content-center align-items-center gap-3 px-4 py-2 bg-white rounded-3 shadow-sm">
                <label htmlFor="speedInput" className="form-label fw-semibold text-secondary mb-1">
                    Speed: {speed.toFixed(2)}x
                </label>
                <input type="number" id="speedInput" className="form-control" min="0.5" max="2" step="0.05" value={speed} onChange={handleSpeedChange} style={{width: "80px", textAlign: "center", padding: "0.25rem 0.5rem",fontSize: "0.9rem",}}/>
            </div>

        </nav>
    );
}


export default ControlButtons;
