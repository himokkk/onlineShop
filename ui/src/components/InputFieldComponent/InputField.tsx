import React from "react";
import { IconType } from "react-icons";

import "./input.css";

interface Props {
    id?: string;
    placeholder: string;
    name?: string;
    label: string;
    icon?: IconType;
    password?: boolean;
    onChange?: Function;
    required?: boolean;
}

const InputField: React.FC<Props> = (props: Props) => {
    let type = props.password ? "password" : "text";

    return (
        <div className="input-main">
            <label className="prevent-select">{props.label}</label>
            {props.icon ? <props.icon size="18" /> : <div></div>}
            <input
                type={type}
                name={props.name}
                aria-label={props.label}
                placeholder={props.placeholder}
                id={props.id}
                spellCheck="false"
                autoComplete="false"
                className="prevent-select"
                required={props.required}
                onChange={e => {
                    if (props.onChange) props.onChange(e.target.value);
                }}
            />
        </div>
    );
};

export default InputField;
