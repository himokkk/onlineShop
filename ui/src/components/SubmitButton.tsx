import React from "react";

import "../css/button.css";

interface Props {
    name: string;
}

const SubmitButton: React.FC<Props> = (props: Props) => {
    return (
        <button className="submit-button prevent-select" type="submit">
            {props.name}
        </button>
    );
};

export default SubmitButton;
