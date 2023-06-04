import React, { useState, useEffect, useRef } from "react";

import getCookie from "../../functions/getCookie";
import getData from "../../functions/getData";
import Category from "../../interfaces/category";

import InputField from "../InputFieldComponent/InputField";
import SubmitButton from "../SubmitButtonComponent/SubmitButton";
import TextArea from "../TextAreaComponent/TextArea";
import Cookies from "universal-cookie";

import "./reviewmodal.css";
import RatingComponent from "../RatingComponent/RatingComponent";

interface Props {
    product_id: number;
}

const ReviewCreateModal = (props: Props) => {
    const cookies = new Cookies();
    const modalRef = useRef(null);
    const errorRef = useRef(null);
    const productForm = useRef(null);

    const [reviewStyle, setReviewStyle] = useState<string>("overall");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [overallRating, setOverallRating] = useState(1);
    const [communicationRating, setCommunicationRating] = useState(1);
    const [productRating, setProductRating] = useState(1);
    const [shippingRating, setShippingRating] = useState(1);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (productForm.current) {
            let form_data = new FormData(productForm.current);
            const csrftoken = getCookie("csrftoken") as string;
            const token = cookies.get("token");
            form_data.append("review_type", reviewStyle);
            form_data.append("overall_rating", String(overallRating === 0 ? 1 : overallRating));
            form_data.append("communication_rating", String(communicationRating));
            form_data.append("quality_rating", String(productRating));
            form_data.append("delivery_rating", String(shippingRating));
            form_data.append("product", String(props.product_id));
            fetch("/api/review/update/", {
                method: "PUT",
                headers: {
                    "X-CSRFToken": csrftoken,
                    Authorization: token,
                },
                body: form_data,
            }).then(response => {
                if (response.ok) setIsVisible(false);
                else if (errorRef.current) (errorRef.current as HTMLElement).innerHTML = "Error";
            });
        }
    };

    return (
        <div className="modal_main">
            <div onClick={() => setIsVisible(true)} className="add_product_button">
                Give Review
            </div>
            {isVisible ? (
                <div className="modal" ref={modalRef}>
                    <div className="modal_content prevent-select">
                        <span className="modal_close" onClick={() => setIsVisible(false)}>
                            &times;
                        </span>
                        <span ref={errorRef}>Give a review!</span>
                        <div className="type__buttons">
                            <button
                                onClick={() => setReviewStyle("overall")}
                                className={
                                    reviewStyle === "overall"
                                        ? "type__button  orange_button"
                                        : "type__button  transparent"
                                }
                            >
                                Overall
                            </button>
                            <button
                                onClick={() => setReviewStyle("detailed")}
                                className={
                                    reviewStyle !== "overall"
                                        ? "type__button  orange_button"
                                        : " type__button transparent"
                                }
                            >
                                Detailed
                            </button>
                        </div>
                        <form ref={productForm} onSubmit={SubmitForm} className="review_form">
                            {reviewStyle === "overall" ? (
                                <div>
                                    <span>Overall:</span> <RatingComponent setRating={setOverallRating} />
                                </div>
                            ) : (
                                <div className="detailed_rating">
                                    <div>
                                        <span>Product: </span>
                                        <RatingComponent setRating={setProductRating} />
                                    </div>
                                    <div>
                                        <span>Communication: </span>
                                        <RatingComponent setRating={setCommunicationRating} />
                                    </div>
                                    <div>
                                        <span>Shipping: </span>
                                        <RatingComponent setRating={setShippingRating} />
                                    </div>
                                </div>
                            )}
                            <TextArea name="description" label="Review Description" placeholder="Description" />
                            <SubmitButton name="Create Product" />
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ReviewCreateModal;
