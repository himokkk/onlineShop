import React, { useState, useEffect, useRef } from "react";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShop, AiOutlineMail } from "react-icons/ai";
import { BsFillKeyFill } from "react-icons/bs";

import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import postData from "../functions/postData";
import resetErrors from "../functions/resetErrors";

import "../css/login.css";

const LoginPage: React.FC = () => {
    const formRef = useRef(null);
    const loginFormRef = useRef(null);
    const productForm = useRef(null);
    
    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        if (cookies.get("token")) {
            navigate("/");
        }
    }, []);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(loginFormRef.current) {
            let form_data = new FormData(loginFormRef.current);
            postData({ url: "/api/login/", data: form_data }).then(response => {
                response?.json();
                if (response["token"]) {
                    cookies.set("token", response["token"], { path: "/" });
                    navigate("/");
                }
            });
        }
    };

    return (
        <div className="container">
            <form className="content" ref={loginFormRef} onSubmit={SubmitForm}>
                <div className="shop-logo prevent-select">
                    <AiOutlineShop className="logo" size="100" />
                    <div className="mt-1">Shop</div>
                </div>
                <div className="input-container">
                    <InputField
                        id="username-input"
                        name="username"
                        placeholder="Username"
                        label="Username"
                        icon={AiOutlineMail}
                    />
                    <div className="hidden-text">
                        Username required
                    </div>
                </div>

                <div className="input-container">
                    <InputField
                        password={true}
                        name="password"
                        id="password-input"
                        placeholder="Password"
                        label="Password"
                        icon={BsFillKeyFill}
                    />
                    <div className="hidden-text">
                        Password required
                    </div>
                </div>

                <div className="login-button">
                    <SubmitButton name="Log in!" />
                </div>

                <div className="forgotten">
                    <Link to="/password/reset">Forgotten your password?</Link>
                </div>
                <div className="signup">
                    <div className="">Don`t have an account?</div>
                    <Link to="/signup" className="link">
                        Sign up!
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
