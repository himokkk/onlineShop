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
    icon?: IconType;
}

const Select = (props: Props) => {
    return (
        <div id={props.id} className="select prevent-select">
            <label htmlFor="select">{props.label}</label>
            {props.icon ? <props.icon className="select-icon" size="18" /> : <div></div>}
            <select name={props.name}>
                <option selected disabled hidden>
                    {props.default}
                </option>
                {props.options.map((object: SelectInterface) => {
                    return (
                        <option className="object prevent-select" value={object.id}>
                            {object.name}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default Select;
