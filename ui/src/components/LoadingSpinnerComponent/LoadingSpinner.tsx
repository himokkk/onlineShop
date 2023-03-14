import React from "react";

import "./spinner.css";

interface Props {
    active?: boolean;
}

const LoadingSpinner = (props: Props) => {
    return (
        <div className="lds">
            {props.active ? (
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default LoadingSpinner;
