import React from "react";

import "./submitbutton.css";

interface Props {
    id?: string;
    name: string;
}

const SubmitButton: React.FC<Props> = (props: Props) => {
    return (
        <button id={props.id} className="submit-button prevent-select" type="submit">
            {props.name}
        </button>
    );
};

export default SubmitButton;
