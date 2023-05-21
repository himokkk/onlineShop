import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineMail, AiOutlineShop } from "react-icons/ai";
import InputField from "../components/InputFieldComponent/InputField";
import SubmitButton from "../components/SubmitButtonComponent/SubmitButton";
import getCookie from "../functions/getCookie";
import "../css/passwordreset.css";

const PasswordResetPage: React.FC = () => {
    const { hash } = useParams();
    const formRef = useRef(null);
    const navigate = useNavigate();

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formRef.current) {
            let form_data = new FormData(formRef.current);
            const new_password = form_data.get("password") as string;
            const password_repeat = form_data.get("password_repeat") as string;
            if (new_password !== password_repeat || new_password.length < 5) return;

            const csrftoken = getCookie("csrftoken") as string;
            fetch("/api/user/reset_password/" + hash, {
                method: "PUT",
                headers: {
                    "X-CSRFToken": csrftoken,
                },
                body: form_data,
            })
                .then(response => {
                    if (response && response.ok) {
                        navigate("/login");
                        return response.json();
                    }
                    throw response;
                })
                .then(data => {})
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        }
    };

    return (
        <div className="container">
            <form className="content" ref={formRef} onSubmit={SubmitForm}>
                <div className="shop-logo prevent-select">
                    <AiOutlineShop className="logo" size="100" />
                    <div className="mt-1">Shop</div>
                </div>
                <div className="input-container">
                    <div className="password_reset_input">
                        <InputField
                            id="new_password_input"
                            name="password"
                            placeholder="New password"
                            password={true}
                            label="New password"
                            icon={AiOutlineMail}
                        />
                    </div>
                    <div className="password_reset_input">
                        <InputField
                            id="password_repeat_input"
                            name="password_repeat"
                            placeholder="Repeat password"
                            password={true}
                            label="Repeat password"
                            icon={AiOutlineMail}
                        />
                    </div>
                </div>
                <div className="login-button" id="password_reset_button_container">
                    <SubmitButton name="Change password" />
                </div>
            </form>
        </div>
    );
};

export default PasswordResetPage;
