import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const LogoutPage: React.FC = (() => {
    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        cookies.remove("token", { path: "/" });
        navigate("/login");
    })

    return(<div>Logout!</div>);
});

export default LogoutPage;