/*Text editor component */
function TextEditor({
    procText,
    setProcText
})

{
    return (
        <div className="text-editor-container">
            <label htmlFor="exampleFormControlTextarea1" className="text-editor-label">Text to preprocess:</label>
            <textarea className="text-editor-textarea"  rows="15" id="proc" value={procText} onChange={(e) => setProcText(e.target.value)}></textarea>
        </div>
    );
}

export default TextEditor;
