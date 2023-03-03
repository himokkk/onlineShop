import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShop, AiOutlineMail } from "react-icons/ai";
import { BsFillKeyFill } from "react-icons/bs";

import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import postData from "../functions/postData";

import "../css/login.css";

const SignupPage: React.FC = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [repeatedPassword, setRepeatedPassword] = useState("");
    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        if (cookies.get("token")) {
            navigate("/");
        }
    }, []);

    const click = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (password !== repeatedPassword) {
            return;
        }
        let data = { username: login, password: password };
        postData({ url: "/api/login/", data: data })
            .then(response => {
                if (response["token"]) {
                    navigate("/");
                } else {
                    const div = document.getElementById("UsernameError") as HTMLDivElement;
                    if (div) {
                        div.classList.remove("hidden");
                    }
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    };

    return (
        <div className="container">
            <div className="content">
                <div className="shop-logo prevent-select">
                    <AiOutlineShop className="logo" size="100" />
                    <div>Shop</div>
                </div>

                <div className="input-container">
                    <InputField
                        id="username-input"
                        placeholder="Username"
                        label="Username"
                        setFunc={setLogin}
                        icon={AiOutlineMail}
                    />
                    <div className="hidden-text" id="UsernameError">
                        Username required
                    </div>
                </div>
                <div className="input-container">
                    <InputField
                        password={true}
                        id="password-input"
                        placeholder="Password"
                        label="Password"
                        setFunc={setPassword}
                        icon={BsFillKeyFill}
                    />
                    <div className="hidden-text" id="PasswordError">
                        Password required
                    </div>
                </div>
                <div className="input-container">
                    <InputField
                        password={true}
                        id="repeated-password-input"
                        placeholder="Repeat Password"
                        label="Repeat Password"
                        setFunc={setRepeatedPassword}
                        icon={BsFillKeyFill}
                    />
                    <div className="hidden-text" id="RepeatedPasswordError">
                        Passwords must match
                    </div>
                </div>

                <div className="login-button">
                    <SubmitButton name="Sign up!" onClick={click} />
                </div>
                <div className="login">
                    <div>Already has an account?</div>
                    <Link to="/login" className="link">
                        Log in!
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
