import React from "react";
import { IconType } from "react-icons";

import SelectInterface from "./selectInterface";
import "./select.css";

interface Props {
    id?: string;
    label?: string;
    name: string;
    default: string;
    options: SelectInterface[];
    setFunction?: Function;
    icon?: IconType;
}

const Select = (props: Props) => {
    return (
        <div id={props.id} className="select prevent-select">
            <label htmlFor="select">{props.label}</label>
            {props.icon ? <props.icon className="select-icon" size="18" /> : null}
            <select
                name={props.name}
                onChange={e => {
                    if (props.setFunction) props.setFunction(e.target.value);
                }}
            >
                <option selected disabled hidden>
                    {props.default}
                </option>
                {props.options.map((object: SelectInterface) => {
                    return (
                        <option className="select-option prevent-select" value={object.id}>
                            {object.name}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default Select;
