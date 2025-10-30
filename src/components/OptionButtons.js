function OptionButtons({ option, setOption, instrument, setInstrument }) {
    return (
        <div className="bg-white shadow-sm rounded-3 p-3">
            <h5 className="text-success fw-bold mb-3 text-center">Processing Options</h5>

            <div className="form-check mb-2">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    checked={option === "on"}
                    onChange={() => setOption("on")}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    p1: ON
                </label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    checked={option === "hush"}
                    onChange={() => setOption("hush")}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    p1: HUSH
                </label>
            </div>

            <h6 className="text-primary fw-bold mb-2 text-center">Instrument Selection</h6>
            {["bass", "synth", "drum"].map((ins) => (
                <div className="form-check" key={ins}>
                    <input className="form-check-input" type="radio" name="instrumentSelect" id={`instrument-${ins}`} checked={instrument === ins} onChange={() => setInstrument(ins)}/>
                    <label className="form-check-label" htmlFor={`instrument-${ins}`}>
                        {ins.charAt(0).toUpperCase() + ins.slice(1)}
                    </label>
                </div>
            ))}
        </div>
    );
}

export default OptionButtons;
