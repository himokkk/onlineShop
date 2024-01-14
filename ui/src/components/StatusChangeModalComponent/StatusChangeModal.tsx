import React, { useState, useEffect, useRef } from "react";
import getCookie from "../../functions/getCookie";
import InputField from "../InputFieldComponent/InputField";

import "./statuschangemodal.css";
import SubmitButton from "../SubmitButtonComponent/SubmitButton";
import Cookies from "universal-cookie";
import apiCall from "../../functions/apiCall";
import backendConfig from "../../urls";

interface Props {
    id: number;
}

const StatusChangeModal = (props: Props) => {
    const cookies = new Cookies();
    const statusFormRef = useRef(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (statusFormRef.current) {
            let data = new FormData(statusFormRef.current);
            data.append("status", "sent");

            apiCall({url: backendConfig.orders_status + props.id, method: "PATCH", data: data})
                .then(response => {
                    if (response.ok) setIsVisible(false);
                    // else if (errorRef.current) (errorRef.current as HTMLElement).innerHTML = "Error";
                });
        }
    };

    return (
        <div className="modal_main">
            <div onClick={() => setIsVisible(true)} className="change_status prevent-select">
                Send package
            </div>
            {isVisible ? (
                <div className="modal">
                    <div className="modal_content">
                        <span className="modal_close" onClick={() => setIsVisible(false)}>
                            &times;
                        </span>
                        <form ref={statusFormRef} onSubmit={SubmitForm}>
                            Send package #{props.id}
                            <InputField label="Package number" name="package_number" placeholder="Package number" />
                            <SubmitButton name="Submit package number" />
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default StatusChangeModal;
