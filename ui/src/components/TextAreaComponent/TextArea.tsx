import React from "react";

import "./textarea.css";

interface Props {
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
}

const TextArea = (props: Props) => {
    return (
        <div id={props.id} className="textarea">
            <label>{props.label}</label>
            <textarea rows={6} placeholder={props.placeholder} name={props.name} />
        </div>
    );
};

export default TextArea;
