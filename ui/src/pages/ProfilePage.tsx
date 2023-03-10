import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";

import getData from "../functions/getData";
import postData from "../functions/postData";
import NavBar from "../components/NavBarComponent/NavBar";

import "../css/profile.css";

const ProfilePage: React.FC = () => {
    const { id } = useParams();
    const cookies = new Cookies();

    const [user_id, setUserId] = useState<number>();
    const [username, setUsername] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");

    useEffect(() => {
        const form_data = new FormData();
        form_data.append("token", cookies.get("token"));
        postData({ url: "/api/user/current/", data: form_data }).then(response => {});

        getData({ url: "/api/user/" + id }).then(response => {
            const image_url = response["image_url"];
            const user_id = response["user"];
            const username = response["username"];
            const description = response["description"];
            setUserId(user_id);
            setUsername(username);
            setDescription(description);
            if (image_url) {
                setImageURL(image_url);
            } else {
                setImageURL("media/profile/default.png");
            }
        });
    }, []);

    return (
        <div>
            <NavBar />
            <div className="profile-container">
                <img src={imageURL} className="prevent-select" />
                <div className="profile-main">
                    <span>{username}</span>
                    <hr />
                    <div className="profile-description">{description}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
