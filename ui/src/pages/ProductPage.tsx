import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import getData from "../functions/getData";
import NavBar from "../components/NavBarComponent/NavBar";
import SubmitButton from "../components/SubmitButtonComponent/SubmitButton";

import Cookies from "universal-cookie";

import "../css/basic.css";
import "../css/product.css";

const ProductPage = (() => {
    const { id } = useParams();
    const cookies = new Cookies();
    
    const [name, setName] = useState<string>("");    
    const [imageURL, setImageURL] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [shippingPrice, setShippingPrice] = useState<number>(0);
    const [postDate, setPostDate] = useState<Date>();
    const [ownerId, setOwnerId] = useState<number>(0);
    const [ownerName, setOwnerName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        const form_data = new FormData();
        form_data.append("token", cookies.get("token"));

        getData({ url: "/api/product/" + id }).then(response => {
            setName(response["name"]);
            setPrice(response["price"]);
            setShippingPrice(response["shipping_price"]);
            setPostDate(response["post_date"]);
            setOwnerId(response["owner"]);
            setOwnerName(response["owner_name"]);
            setDescription(response["description"]);

            const image_url = response["image_url"];
            if (image_url) {
                setImageURL(image_url);
            } else {
                setImageURL("media/product/default.png");
            }
        });
    }, []);
    
    return(
        <div>
            <NavBar />
            <div  className="product-container">
                <div>
                    <div className="product-header">
                        <img src={imageURL} className="product-picture prevent-select" />
                        <div className="product-main">
                            <span>{name}</span>
                            <hr />
                            Price: {price} zł <br/>
                            Shiping cost: {shippingPrice} zł<br/>
                            Total: {price + shippingPrice} zł <br/>
                            <Link to={"/buy/" + id}>
                                <SubmitButton name="buy" id="buy-button"/>
                            </Link>
                        </div>
                    </div>
                    <div className="profile-description">
                        Description: {description}
                    </div>
                </div>
            </div>
        </div>
    )
});

export default ProductPage;