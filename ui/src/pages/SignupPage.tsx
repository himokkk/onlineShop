import React, { useEffect, useRef, RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { AiOutlineShop, AiOutlineMail } from "react-icons/ai";
import { BsFillKeyFill } from "react-icons/bs";

import InputField from "../components/InputFieldComponent/InputField";
import SubmitButton from "../components/SubmitButtonComponent/SubmitButton";
import postData from "../functions/postData";
import resetErrors from "../functions/resetErrors";
import setBlock from "../functions/setBlock";

import "../css/basic.css";
import "../css/login.css";

const SignupPage: React.FC = () => {
    const signupFormRef = useRef(null);
    const usernameError1Ref = useRef(null);
    const usernameError2Ref = useRef(null);
    const passwordError1Ref = useRef(null);
    const passwordError2Ref = useRef(null);
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

        resetErrors([usernameError1Ref, usernameError2Ref, passwordError1Ref, passwordError2Ref, internalErrorRef]);
        if (signupFormRef.current) {
            let form_data = new FormData(signupFormRef.current);
            if (!form_data.get("username")) {
                setBlock(usernameError1Ref);
                return;
            }
            if (!form_data.get("password")) {
                setBlock(passwordError1Ref);
                return;
            }

            if (form_data.get("password") !== form_data.get("repeat-password")) {
                setBlock(passwordError2Ref);
                return;
            }

            postData({ url: "/api/signup/", data: form_data })
                .then(response => {
                    if (response && response.ok) {
                        navigate("/login");
                        return;
                    }
                    throw response;
                })
                .catch(error => {
                    if (error["username"]) {
                        setBlock(usernameError2Ref);
                        return;
                    }
                    console.error("Error:", error);
                    setBlock(internalErrorRef);
                });
        }
    };

    return (
        <div className="container">
            <form ref={signupFormRef} onSubmit={SubmitForm} className="content">
                <div className="shop-logo prevent-select">
                    <AiOutlineShop className="logo" size="100" />
                    <div>Shop</div>
                </div>

                <div className="input-container">
                    <InputField
                        id="username-input"
                        name="username"
                        placeholder="Username"
                        label="Username"
                        icon={AiOutlineMail}
                    />
                    <div ref={usernameError1Ref} className="hidden-text">
                        Username required
                    </div>
                    <div ref={usernameError2Ref} className="hidden-text">
                        Username is taken
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
                    <div ref={passwordError1Ref} className="hidden-text">
                        Password required
                    </div>
                </div>
                <div className="input-container">
                    <InputField
                        password={true}
                        name="repeat-password"
                        id="repeated-password-input"
                        placeholder="Repeat Password"
                        label="Repeat Password"
                        icon={BsFillKeyFill}
                    />
                    <div ref={passwordError2Ref} className="hidden-text">
                        Passwords must match
                    </div>
                    <div ref={internalErrorRef} className="hidden-text">
                        Internal Error
                    </div>
                </div>

                <div className="login-button">
                    <SubmitButton name="Sign up!" />
                </div>
                <div className="login">
                    <div>Already has an account?</div>
                    <Link to="/login" className="blue_link">
                        Log in!
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SignupPage;
