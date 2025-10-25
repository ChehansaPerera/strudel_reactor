function TextEditor({
    procText,
    setProcText
})

{
    return (
        <div className="col-md-8">
            <label htmlFor="exampleFormControlTextarea1" className="form-label fw-semibold text-indigo-700">Text to preprocess:</label>
            <textarea className="form-control border border-gray-300 rounded-2" rows="15" id="proc" value={procText} onChange={(e) => setProcText(e.target.value)}></textarea>
        </div>
    );
}

export default TextEditor;
