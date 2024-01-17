import React, {useEffect, useState} from "react";

import "./fileinput.css";

interface Props {
    id?: string;
    name?: string;
    label?: string;
    required?: boolean;
    accept?: string;
}

const FileInput = (props: Props) => {
    const [selectedFileName, setSelectedFileName] = useState<string>('');

    useEffect(() => {
        if(selectedFileName.length > 15) setSelectedFileName(selectedFileName.substring(0, 15) + "...");
    }, [selectedFileName])

    return (
        <div id={props.id} className="file-input">
            <div>{props.label}</div>
            <label htmlFor="file-input">
            {selectedFileName ? selectedFileName : "Choose a file"}</label>
            <input type="file" id="file-input" name={props.name} required={props.required} accept={props.accept}
               onChange={e => {
                    const file = e.target.files![0];

                    if (file) {
                        setSelectedFileName(file.name);
                    }
                    else {
                        setSelectedFileName('');
                    }
               }} />
        </div>
    );
};

export default FileInput;
