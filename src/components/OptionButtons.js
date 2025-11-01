function OptionButtons({ option, setOption, instrument, setInstrument }) {
    return (
        <div className="option-controller-container">
            <h5 className="option-controller-title">Processing Options</h5>

            <div className="option-controller">
                <div className="form-check">
                    <input
                        type="radio"
                        name="processingOption"
                        id="optionOn"
                        checked={option === "on"}
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
                        checked={option === "hush"}
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
                            checked={instrument === ins}
                            onChange={() => setInstrument(ins)}
                        />
                        <label className="form-check-label" htmlFor={`instrument-${ins}`}>
                            {ins.charAt(0).toUpperCase() + ins.slice(1)}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OptionButtons;
