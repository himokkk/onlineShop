import React, { useState, useEffect } from "react";
import postData from "../../functions/postData";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

import "./navbar.css";

const NavBar: React.FC = () => {
    const cookies = new Cookies();
    const [user_id, setUserId] = useState<number>();
    const [imageURL, setImageURL] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    useEffect(() => {
        const form_data = new FormData();
        form_data.append("token", cookies.get("token"));
        postData({ url: "/api/user/current/", data: form_data })
            .then(response => {
                if (response && response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                const image_url = data["image_url"];
                const user_id = data["user"];
                setUserId(user_id);
                if (image_url) {
                    setImageURL(image_url);
                } else {
                    setImageURL("media/profile/default.png");
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const Click = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const div = event.target as HTMLElement;
        try {
            if (!div.className.includes("dropdown-active")) setShowDropdown(false);
        } catch (e) {}
    };

    useEffect(() => {
        // @ts-ignore
        document.addEventListener("click", Click);
        // @ts-ignore
        return () => document.removeEventListener("click", Click);
    });

    return (
        <div className="navbar-container">
            <Link to="/" id="home-button" className="nav-button">
                Home
            </Link>
            <div className="left-nav">
                <div className="search-button nav-button">Search</div>
                <div className="dropdown nav-button" id="dropdown-image" onClick={() => setShowDropdown(!showDropdown)}>
                    <img src={imageURL} className="dropdown-active" />
                </div>
                <div id="dropdown" className={showDropdown ? "dropdown-active" : "hidden"}>
                    <div className="dropdown-active">
                        <div className="dropdown-active">
                            <a href={"/#/profile/" + user_id} className="nav-profile">
                                Profile
                            </a>
                        </div>
                        <div className="dropdown-active">
                            <a href="#" className="nav-settings">
                                Settings
                            </a>
                        </div>
                    </div>
                    <div className="dropdown-active">
                        <Link to="/logout" className="nav-logout">
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
