import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShop, AiOutlineMail } from "react-icons/ai";
import { BsFillKeyFill } from "react-icons/bs";

import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import postData from "../functions/postData";

import "../css/login.css";

const LoginPage: React.FC = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        if (cookies.get("token")) {
            navigate("/");
        }
    }, []);

    const click = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        let data = { username: login, password: password };
        postData({ url: "/api/login/", data: data }).then(response => {
            if (response["token"]) {
                cookies.set("token", response["token"], { path: "/" });
                navigate("/");
            }
        });
    };

    return (
        <div className="container">
            <div className="content">
                <div className="shop-logo prevent-select">
                    <AiOutlineShop className="logo" size="100" />
                    <div className="mt-1">Shop</div>
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

                <div className="login-button">
                    <SubmitButton name="Log in!" onClick={click} />
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
            </div>
        </div>
    );
};

export default LoginPage;
