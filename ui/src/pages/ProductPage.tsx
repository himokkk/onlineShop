import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import apiCall from "../functions/apiCall";
import NavBar from "../components/NavBarComponent/NavBar";
import SubmitButton from "../components/SubmitButtonComponent/SubmitButton";
import Review from "../interfaces/review";

import Cookies from "universal-cookie";

import "../css/basic.css";
import "../css/product.css";
import RatingComponent from "../components/RatingComponent/RatingComponent";

const ProductPage = () => {
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
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const form_data = new FormData();
        form_data.append("token", cookies.get("token"));

        apiCall({ url: "/api/product/" + id, method: "GET"}).then(response => {
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
            setReviews(response["reviews"]);
        });
    }, []);

    const AddToCart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const token = cookies.get("token");
        const form_data = new FormData();
        form_data.append("token", token);
        // @ts-ignore
        form_data.append("item", id as number);

        apiCall({ url: "/api/cart/add/", method: "POST", data: form_data })
            .then(data => {})
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    return (
        <div>
            <NavBar />
            <div className="product-container">
                <div className="profile">
                    <div className="product-header">
                        <img src={imageURL} className="product-picture prevent-select" />
                        <div className="product-main">
                            <span>{name}</span>
                            <hr />
                            Price: {price} zł <br />
                            Shiping cost: {shippingPrice} zł
                            <br />
                            Total: {price + shippingPrice} zł <br />
                            <SubmitButton name="Add to cart" id="buy-button" onClick={AddToCart} />
                            User: <a href={"/#/profile/" + ownerId}>{ownerName ? ownerName : "Unknown"}</a>
                        </div>
                    </div>
                    <div className="profile-description">Description: {description}</div>
                </div>
                <div>
                    <div>
                        {reviews.map(review => (
                            <div className="review_container">
                                User: <a href={"/#/profile/" + review.owner}>{review.owner_name}</a>
                                {review.review_type === "overall" ? (
                                    <RatingComponent defaultValue={review.overall_rating} />
                                ) : (
                                    <div>
                                        Quality: <RatingComponent defaultValue={review.quality_rating} />
                                        Communication: <RatingComponent defaultValue={review.communication_rating} />
                                        Delivery: <RatingComponent defaultValue={review.delivery_rating} />
                                    </div>
                                )}
                                <div>Description: {review.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
