import React from "react";

import "../css/button.css";

interface Props {
    name: string;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const SubmitButton: React.FC<Props> = (props: Props) => {
    return (
        <div className="submit-button prevent-select" onClick={props.onClick}>
            {props.name}
        </div>
    );
};

export default SubmitButton;
