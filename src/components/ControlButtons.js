import { useState } from "react";
import { setGlobalVolume, setPlaybackSpeed, ProcAndPlay} from "./StrudelSetup";

/*Control panel component for managing Strudel player settings and actions*/
function ControlButtons({ onPlay, onStop, onProcess, onProcessAndPlay, instrument, option, setInstrument, setOption, setProcText}) {
    const [volume, setVolume] = useState(0.8);
    const [speed, setSpeed] = useState(1.0);

    // Handle volume changes from slider
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        // Apply new volume globally
        setGlobalVolume(newVolume);
    };

    // Handle speed change from the input field
    const handleSpeedChange = (e) => {
        let newSpeed = parseFloat(e.target.value);
        // Minimum speed is 0.5 and Maximum speed is 2.0
        if (newSpeed < 0.5) newSpeed = 0.5;
        if (newSpeed > 2) newSpeed = 2;
        setSpeed(newSpeed);
        // Update the playback speed
        setPlaybackSpeed(newSpeed, setProcText);
        ProcAndPlay(instrument);

    };

    // Download current control settings as a Json file
    const handleDownloadJSON = () => {
        const controlState = { volume, speed, instrument, option };

        const json = JSON.stringify(controlState, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        // Create a temporary link to trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = "controls_state.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    // Upload control settings from Json file
    const handleUploadJSON = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                // Validate the json structure to fit the control settings
                if (
                    typeof data.volume === "number" &&
                    typeof data.speed === "number" &&
                    typeof data.instrument === "string" &&
                    typeof data.option === "string"
                )
                {
                    // Apply loaded values 
                    setVolume(data.volume);
                    setSpeed(data.speed);
                    setInstrument(data.instrument);
                    setOption(data.option);
                    setGlobalVolume(data.volume);
                    setPlaybackSpeed(data.speed);

                    alert("Controls successfully loaded from Json file!");
                }
                else
                {
                    alert("Invalid JSON structure. Please use a valid controls_state.json file.");
                }
            }
            catch (err)
            {
                alert("Error reading JSON file. Make sure it's valid Json.");
                console.error(err);
            }
        };

        reader.readAsText(file);
        // Reset file input
        e.target.value = ""; 
    };

    return (
        <nav className="controls-container">
            <h5 className="controls-title">Controls</h5>

            <div className="controls-icons">
                <i id="process" className="bi bi-arrow-clockwise icon-btn" onClick={onProcess} title="Preprocess"></i>
                <i id="process_play" className="bi bi-play-circle-fill icon-btn" onClick={onProcessAndPlay} title="Proc and Play"></i>
                <i id="play" className="bi bi-play-fill icon-btn" onClick={onPlay} title="Play"></i>
                <i id="stop" className="bi bi-stop-fill icon-btn" onClick={onStop} title="Stop"></i>
                <i id="download" className="bi bi-download icon-btn" onClick={handleDownloadJSON} title="Download Json controls"></i>

                <label htmlFor="uploadJSON" className="bi bi-upload icon-btn" title="Upload Json controls"></label>
                <input type="file" id="uploadJSON" accept=".json" onChange={handleUploadJSON} style={{ display: "none" }}/>
            </div>

            {/* Volume control slider */}
            <div className="control-section">
                <label htmlFor="volumeSlider" className="control-label"> Volume: {(volume * 100).toFixed(0)}% </label>
                <input type="range" className="control-range" id="volumeSlider" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} style={{ accentColor: "#4f46e5", cursor: "pointer" }}/>
            </div>

            {/* Playback speed input */}
            <div className="control-section">
                <label htmlFor="speedInput" className="form-label fw-semibold text-secondary mb-1"> Speed: {speed.toFixed(2)}x </label>
                <input type="number" id="speedInput" className="control-number" min="0.5" max="2" step="0.05" value={speed} onChange={handleSpeedChange} style={{width: "80px", textAlign: "center", padding: "0.25rem 0.5rem",fontSize: "0.9rem",}}/>
            </div>

        </nav>
    );
}


export default ControlButtons;
