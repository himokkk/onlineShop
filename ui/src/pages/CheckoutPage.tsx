import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import LoadingSpinner from "../components/LoadingSpinnerComponent/LoadingSpinner";
import ProductComponent from "../components/ProductComponent/ProductComponent";
import InputField from "../components/InputFieldComponent/InputField";
import SubmitButton from "../components/SubmitButtonComponent/SubmitButton";

import Product from "../interfaces/product";
import postData from "../functions/postData";

import "../css/checkout.css";

const CheckoutPage = () => {
    const checkoutForm = useRef(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [spinnerActive, setSpinnerActive] = useState<boolean>(true);
    const [cartSum, setCartSum] = useState<number>(0);
    const [cartShipping, setCartShipping] = useState<number>(0);

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.get("token")) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        const token = cookies.get("token");
        const form_data = new FormData();
        form_data.append("token", token);
        postData({ url: "/api/user/current/", data: form_data, setActiveSpinner: setSpinnerActive })
            .then(response => {
                if (response && response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                setProducts(data["cart"]);
            });
    }, []);

    useEffect(() => {
        let sum = 0;
        let shippingSum = 0;
        products.forEach((object: Product) => {
            sum += object.price;
            shippingSum += object.shipping_price;
        });
        setCartSum(sum);
        setCartShipping(shippingSum);
    }, [products]);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (checkoutForm.current) {
            let form_data = new FormData(checkoutForm.current);
            const token = cookies.get("token");
            form_data.append("token", token);
            products.forEach((object: Product) => {
                form_data.append("items[]", String(object.id));
            });
            let id = 0;
            postData({
                url: "/api/order/create/",
                data: form_data,
                setActiveSpinner: setSpinnerActive,
            })
                .then(response => {
                    if (response && response.ok) {
                        return response.json();
                    }
                    throw response;
                })
                .then(data => {
                    id = data["id"];
                    navigate("/pay/" + id);
                });
        }
    };

    return (
        <div className="checkout-container">
            {spinnerActive ? (
                <LoadingSpinner />
            ) : (
                <form ref={checkoutForm} onSubmit={SubmitForm} className="checkout_form">
                    <div className="inputs_container">
                        <InputField placeholder={"Last Name"} label={"Last Name"} name="last_name" />
                        <InputField placeholder={"First Name"} label={"First Name"} name="first_name" />
                        <InputField placeholder={"Phone number"} label={"Phone number"} name="phone_number" />
                        <InputField placeholder={"Country"} label={"Country"} name="country" />
                        <InputField placeholder={"City"} label={"City"} name="city" />
                        <InputField placeholder={"Street"} label={"Street"} name="street" />
                        <InputField placeholder={"Address line 2"} label={"Address line 2"} name="apartament" />
                        <InputField placeholder={"Postal code"} label={"Postal code"} name="postal_code" />
                    </div>
                    <div className="checkout_summary">
                        <div className="checkout_products_container">
                            {products.map((object: Product) => {
                                return <ProductComponent product={object} size={0} />;
                            })}
                        </div>
                        <div className="checkout_prices_button">
                            <div className="checkout_prices">
                                <div>
                                    <span>Product price:</span>
                                    {cartSum} zł
                                </div>
                                <div>
                                    <span>Shipping price:</span> {cartShipping} zł
                                </div>
                                <div id="total_price">
                                    <span>Total price:</span> {cartSum + cartShipping} zł
                                </div>
                            </div>
                            <div className="center">
                                <SubmitButton name={"Hop into payment"} />
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CheckoutPage;
