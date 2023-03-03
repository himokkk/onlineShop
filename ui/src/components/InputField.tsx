import React from "react";
import { IconType } from "react-icons";

import "../css/input.css";

interface Props {
    id: string;
    placeholder: string;
    label: string;
    setFunc: Function;
    icon: IconType;
    password?: boolean;
    onChange?: Function;
}

const InputField: React.FC<Props> = (props: Props) => {
    let type = "text";
    if (props.password) {
        type = "password";
    }

    return (
        <div className="input-main">
            <label className="prevent-select">{props.label}</label>
            <div>
                <props.icon size="18" />
            </div>
            <input
                type={type}
                aria-label={props.label}
                placeholder={props.placeholder}
                onChange={e => props.setFunc(e.target.value)}
                id={props.id}
                spellCheck="false"
                autoComplete="false"
                className="prevent-select"
            />
        </div>
    );
};

export default InputField;
