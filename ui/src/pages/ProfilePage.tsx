import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import getData from "../functions/getData";
import NavBar from "../components/NavBarComponent/NavBar";
import ProductList from "../components/ProductsListComponent/ProductsList";

import "../css/basic.css";
import "../css/profile.css";
import ProfilePictureChangeModal from "../components/ProfilePirctureChangeModalComponent/ProfilePictureChangeModal";

const ProfilePage: React.FC = () => {
    const { id } = useParams();

    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");

    useEffect(() => {
        getData({ url: "/api/user/" + id }).then(response => {
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

    const changeProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log("image changed");
    };

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
                    <span>{username}</span>
                    <hr />
                    <div className="profile-description">{description}</div>
                </div>
                <ProductList owner={Number(id)} defaultSize={4} />
            </div>
        </div>
    );
};

export default ProfilePage;
