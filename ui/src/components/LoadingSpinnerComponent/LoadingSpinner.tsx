import React from "react";

import "./spinner.css";

const LoadingSpinner = () => {
    return (
        <div className="lds">
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
