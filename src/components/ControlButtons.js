function ControlButtons({
    onPlay,
    onStop,
    onProcess,
    onProcessAndPlay
})

{
    return (
        <div className="col-md-4 d-flex flex-column justify-content-between">
            <nav className="bg-white shadow-sm rounded-3 p-3 text-center">
                <h5 className="text-indigo-700 fw-semibold mb-3">Controls</h5>
                <div className="d-grid gap-2"> 
                    <button id="process" className="btn btn-outline-primary" onClick={onProcess}>Preprocess</button> 
                    <button id="process_play" className="btn btn-outline-primary" onClick={onProcessAndPlay}>Proc & Play</button> 
                    <button id="play" className="btn btn-success" onClick={onPlay}>Play</button> 
                    <button id="stop" className="btn btn-danger" onClick={onStop}>Stop</button> 
                </div> 
            </nav>
        </div>
    );
}

export default ControlButtons;