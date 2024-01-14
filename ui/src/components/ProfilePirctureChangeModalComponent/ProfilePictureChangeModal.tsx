import React, { useState, useEffect, useRef } from "react";

import getCookie from "../../functions/getCookie";

import SubmitButton from "../SubmitButtonComponent/SubmitButton";
import FileInput from "../FileInputComponent/FileInput";

import Cookies from "universal-cookie";

import "./profilepicturechange.css";
import apiCall from "../../functions/apiCall";

const ProfilePictureChangeModal = () => {
    const cookies = new Cookies();
    const modalRef = useRef(null);
    const errorRef = useRef(null);
    const avatarForm = useRef(null);

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (avatarForm.current) {
            let data = new FormData(avatarForm.current);
            const csrftoken = getCookie("csrftoken") as string;
            apiCall({url: "/api/user/avatar_change/", method: "PUT", data: data})
                .then(response => {
                    if (response.ok) {
                        setIsVisible(false);
                        window.location.reload();
                    } else if (errorRef.current) (errorRef.current as HTMLElement).innerHTML = "Error";
                });
        }
    };

    return (
        <div className="profile_picture_modal_main">
            <div onClick={() => setIsVisible(true)} className="profile_picture_change_button">
                Change
            </div>
            {isVisible ? (
                <div className="modal" ref={modalRef}>
                    <div className="modal_content prevent-select">
                        <span className="modal_close" onClick={() => setIsVisible(false)}>
                            &times;
                        </span>
                        <span ref={errorRef}>Change your avatar!</span>
                        <form ref={avatarForm} onSubmit={SubmitForm}>
                            <FileInput name="image" label="Image" required={true} accept=".jpg, .jpeg, .png" />
                            <SubmitButton name="Change Avatar" />
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ProfilePictureChangeModal;
