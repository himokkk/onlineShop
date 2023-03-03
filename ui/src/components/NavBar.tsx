import React, { useState, useEffect } from "react";
import postData from "../functions/postData";
import Cookies from "universal-cookie";

import "../css/navbar.css";

const NavBar: React.FC = () => {
    const cookies = new Cookies();
    const [user_id, setUserId] = useState<number>();
    const [imageURL, setImageURL] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    useEffect(() => {
        const data = { token: cookies.get("token") };
        postData({ url: "/api/user/current/", data }).then(response => {
            const image_url = response["image_url"];
            const user_id = response["user"];
            setUserId(user_id);
            if (image_url) {
                setImageURL(image_url);
            } else {
                setImageURL("media/profile/default.png");
            }
        });
    }, []);

    const Click = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const div = event.target as HTMLDivElement;
        if (!div.className.includes("dropdown-active")) setShowDropdown(false);
    };

    // @ts-ignore
    document.addEventListener("click", Click);

    return (
        <div className="navbar-container">
            <div id="home-button">Home</div>
            <div className="left-nav">
                <div className="search-button">Search</div>
                <div className="dropdown" id="dropdown-image" onClick={() => setShowDropdown(!showDropdown)}>
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
                        <a href="/api/logout" className="nav-logout">
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
