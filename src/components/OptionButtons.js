import React, { useState } from "react";
/*Component for choosing processing mode (ON / HUSH) and selecting instruments that only need to play*/
function OptionButtons({ option, setOption, instrument, setInstrument, effects, setEffects }) {

    const [showEffects, setShowEffects] = useState(false);

    return (
        <div className="option-controller-container">
            <h5 className="option-controller-title">Processing Options</h5>

            <div className="option-controller">
                <div className="form-check">
                    <input
                        type="radio"
                        name="processingOption"
                        id="optionOn"
                        // Selected if option state is on
                        checked={option === "on"}
                        // Update option to on
                        onChange={() => setOption("on")}
                    />
                    <label className="form-check-label" htmlFor="optionOn">
                        ON
                    </label>
                </div>

                <div className="form-check">
                    <input
                        type="radio"
                        name="processingOption"
                        id="optionHush"
                        // Selected if option state is hush
                        checked={option === "hush"}
                        // Update option to on
                        onChange={() => setOption("hush")}
                    />
                    <label className="form-check-label" htmlFor="optionHush">
                        HUSH
                    </label>
                </div>
            </div>
            <br />
            <h6 className="option-controller-title">Instrument Selection</h6>
            <div className="instrument-options">
                {["all", "bass", "synth", "drum"].map((ins) => (
                    <div className="form-check" key={ins}>
                        <input
                            className="form-check-input"
                            type="radio"
                            name="instrumentSelect"
                            id={`instrument-${ins}`}
                            // Highlight selected instrument
                            checked={instrument === ins}
                            // Update selected instrument
                            onChange={() => setInstrument(ins)}
                        />
                        <label className="form-check-label" htmlFor={`instrument-${ins}`}>
                            {/* Capitalise first letter of the instrument name */}
                            {ins.charAt(0).toUpperCase() + ins.slice(1)}
                        </label>
                    </div>
                ))}
            </div>
            <br />
            {/* Accordion for Effects */}
            <button className="btn btn-outline-info w-100 mt-3 effects-toggle-btn" onClick={() => setShowEffects(!showEffects)}>
                {showEffects ? "Hide Effects" : "Show Effects"}
            </button>

            {showEffects && (
                <div className="effects-accordion mt-3">
                    <h6 className="effects-title">Effects</h6>

                    {/* Filter Sweep */}
                    <div className="effect-control">
                        <label htmlFor="filterSweep" className="effect-label">Filter Sweep (LPF)</label>
                        <input
                            id="filterSweep"
                            type="range"
                            min="300"
                            max="3000"
                            value={effects.filterSweep}
                            onChange={(e) => setEffects((prev) => ({ ...prev, filterSweep: e.target.value }))}
                            className="form-range"
                        />
                    </div>

                    {/* Reverb Depth */}
                    <div className="effect-control">
                        <label htmlFor="reverbDepth" className="effect-label">Reverb Depth</label>
                        <input
                            id="reverbDepth"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={effects.reverbDepth}
                            onChange={(e) => setEffects((prev) => ({ ...prev, reverbDepth: e.target.value }))}
                            className="form-range"
                        />
                    </div>

                    {/* Auto Pan */}
                    <div className="form-check form-switch effect-toggle">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="autoPan"
                            checked={effects.autoPan}
                            onChange={(e) => setEffects((prev) => ({ ...prev, autoPan: e.target.checked }))}
                        />
                        <label className="form-check-label" htmlFor="autoPan">
                            Auto Pan (Stereo movement)
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OptionButtons;
