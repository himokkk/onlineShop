import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import NavBar from "../components/NavBarComponent/NavBar";
import ProductList from "../components/ProductsListComponent/ProductsList";

import "../css/basic.css";
import "../css/profile.css";
import ProfilePictureChangeModal from "../components/ProfilePirctureChangeModalComponent/ProfilePictureChangeModal";
import apiCall from "../functions/apiCall";

const ProfilePage: React.FC = () => {
    const { id } = useParams();

    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");

    useEffect(() => {
        apiCall({ url: "/api/user/" + id, method: "GET" }).then(response => {
            setUsername(response["username"]);
            setDescription(response["description"]);
            setIsOwner(response["owner"]);

            const image_url = response["image_url"];
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
                {isOwner ? (
                    <div className="picture_container">
                        <ProfilePictureChangeModal />
                        <img src={imageURL} className="profile-picture prevent-select" />
                    </div>
                ) : (
                    <img src={imageURL} className="profile-picture prevent-select" />
                )}
                <div className="profile-main">
                    <div className="upper_bar">
                        <span>{username}</span>
                        <Link to={"/message/" + id} className="black_link">
                            <div className="message_button">message</div>
                        </Link>
                    </div>
                    <hr />
                    <div className="profile-description">{description}</div>
                </div>
                <ProductList owner={Number(id)} defaultSize={4} />
            </div>
        </div>
    );
};

export default ProfilePage;
