import React, { useEffect, useRef } from "react";
import { AiOutlineMail, AiOutlineShop } from "react-icons/ai";
import InputField from "../components/InputFieldComponent/InputField";
import SubmitButton from "../components/SubmitButtonComponent/SubmitButton";
import { Link } from "react-router-dom";
import postData from "../functions/postData";
import "../css/forgotten.css";

const ForgottenPasswordPage: React.FC = () => {
    const formRef = useRef(null);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formRef.current) {
            let form_data = new FormData(formRef.current);

            postData({ url: "/api/user/reset_password/", data: form_data })
                .then(response => {
                    if (response && response.ok) {
                        return response.json();
                    }
                    throw response;
                })
                .then(data => {
                    if (data["token"]) {
                        //cookies.set("token", data["token"], { path: "/" });
                        //navigate("/");
                    } else if (data["error"]) {
                        //setBlock(incorrectErrorRef);
                    }
                })
                .catch(error => {
                    //setBlock(internalErrorRef);
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
                    <InputField
                        id="username-input"
                        name="email"
                        placeholder="Email"
                        label="Email"
                        icon={AiOutlineMail}
                    />
                </div>
                <div className="login-button">
                    <SubmitButton name="Send a password reset link!" />
                </div>

                <div className="sign_up">
                    <div className="">Don`t have an account?</div>
                    <Link to="/signup" className="blue_link">
                        Sign up!
                    </Link>
                </div>

                <div className="back_to_login">
                    <Link to="/login" className="blue_link">
                        Back to login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgottenPasswordPage;
