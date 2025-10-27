function TextEditor({
    procText,
    setProcText
})

{
    return (
        <div className="card shadow-sm rounded-4 p-3 flex-grow-1">
            <label htmlFor="exampleFormControlTextarea1" className="text-indigo-700 fw-bold mb-3">Text to preprocess:</label>
            <textarea className="form-control border border-gray-300 rounded-2"  rows="15" id="proc" value={procText} onChange={(e) => setProcText(e.target.value)}></textarea>
        </div>
    );
}

export default TextEditor;
