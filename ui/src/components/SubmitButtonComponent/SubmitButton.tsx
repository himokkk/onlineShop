import React, { MouseEventHandler } from "react";

import "./submitbutton.css";

interface Props {
    id?: string;
    name: string;
    class?: string;
    onClick?: (e: any) => void;
}

const SubmitButton: React.FC<Props> = (props: Props) => {
    return (
        <button
            id={props.id}
            className={"submit-button prevent-select " + props.class}
            type="submit"
            onClick={props.onClick}
        >
            {props.name}
        </button>
    );
};

export default SubmitButton;
