import React from "react";

import "./fileinput.css";

interface Props {
    id?: string;
    name?: string;
    label?: string;
    required?: boolean;
    accept?: string;
}

const FileInput = ((props: Props) => {
    return(
        <div id={props.id} className="file-input">
            <div>{props.label}</div>
            <label htmlFor="file-input">Choose a file</label>
            <input type="file" id="file-input" name={props.name} required={props.required} accept={props.accept} />
        </div>
    )
});

export default FileInput;