function OptionButtons({
    option,
    setOption,
    ProcAndPlay
})
{
    return (
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
    )
}

export default OptionButtons;