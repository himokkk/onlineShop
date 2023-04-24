import React, { useEffect, useRef } from "react";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShop, AiOutlineMail } from "react-icons/ai";
import { BsFillKeyFill } from "react-icons/bs";

import InputField from "../components/InputFieldComponent/InputField";
import SubmitButton from "../components/SubmitButtonComponent/SubmitButton";
import postData from "../functions/postData";
import setBlock from "../functions/setBlock";
import resetErrors from "../functions/resetErrors";

import "../css/basic.css";
import "../css/login.css";

const LoginPage: React.FC = () => {
    const loginFormRef = useRef(null);
    const usernameErrorRef = useRef(null);
    const passwordErrorRef = useRef(null);
    const incorrectErrorRef = useRef(null);
    const internalErrorRef = useRef(null);

    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        if (cookies.get("token")) {
            navigate("/");
        }
    }, []);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        resetErrors([usernameErrorRef, passwordErrorRef, incorrectErrorRef]);
        if (loginFormRef.current) {
            let form_data = new FormData(loginFormRef.current);
            if (!form_data.get("username")) {
                setBlock(usernameErrorRef);
                return;
            }
            if (!form_data.get("password")) {
                setBlock(passwordErrorRef);
                return;
            }
            postData({ url: "/api/login/", data: form_data })
                .then(response => {
                    if (response && response.ok) {
                        return response.json();
                    }
                    throw response;
                })
                .then(data => {
                    if (data["token"]) {
                        cookies.set("token", data["token"], { path: "/" });
                        navigate("/");
                    } else if (data["error"]) {
                        setBlock(incorrectErrorRef);
                    }
                })
                .catch(error => {
                    setBlock(internalErrorRef);
                    console.error("Error fetching data:", error);
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
                    <div className="hidden-text" ref={usernameErrorRef}>
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
                    <div className="hidden-text" ref={passwordErrorRef}>
                        Password required
                    </div>
                    <div className="hidden-text" ref={internalErrorRef}>
                        Internal Error
                    </div>
                    <div className="hidden-text" ref={incorrectErrorRef}>
                        Incorrect username or password
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
