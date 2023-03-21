import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";

import getData from "../functions/getData";
import NavBar from "../components/NavBarComponent/NavBar";
import ProductList from "../components/ProductsListComponent/ProductsList";

import "../css/basic.css";
import "../css/profile.css";

const ProfilePage: React.FC = () => {
    const { id } = useParams();
    const cookies = new Cookies();

    const [username, setUsername] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");

    useEffect(() => {
        getData({ url: "/api/user/" + id }).then(response => {
            const image_url = response["image_url"];
            const username = response["username"];
            const description = response["description"];
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
                <img src={imageURL} className="profile-picture prevent-select" />
                <div className="profile-main">
                    <span>{username}</span>
                    <hr />
                    <div className="profile-description">{description}</div>
                </div>
                <ProductList owner={Number(id)} />
            </div>
        </div>
    );
};

export default ProfilePage;
