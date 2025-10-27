function ControlButtons({
    onPlay,
    onStop,
    onProcess,
    onProcessAndPlay
})

{
    return (
        <nav className="bg-white shadow-sm rounded-3 p-3 text-center">
            <h5 className="text-primary fw-bold mb-3">Controls</h5>
            <div className="d-flex justify-content-center align-items-center gap-4 fs-3">
                <i id="process" className=" bi bi-arrow-clockwise icon-btn" onClick={onProcess} title="Preprocess"></i>
                <i id="process_play" className="bi bi-play-circle-fill icon-btn" onClick={onProcessAndPlay} title="Proc and Play"></i>
                <i id="play" className="bi bi-play-fill icon-btn" onClick={onPlay} title="Play"></i>
                <i id="stop" className="bi bi-stop-fill icon-btn" onClick={onStop} title="Stop"></i>
            </div> 
        </nav>
    );
}

export default ControlButtons;