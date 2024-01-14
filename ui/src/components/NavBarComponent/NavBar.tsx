import React, { useState, useEffect } from "react";
import apiCall from "../../functions/apiCall";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { AiOutlineShop } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";

import ProductComponent from "../ProductComponent/ProductComponent";
import ProductCreateModal from "../ProductCreateModalComponent/ProductCreateModal";
import Product from "../../interfaces/product";

import "./navbar.css";

const NavBar: React.FC = () => {
    const cookies = new Cookies();
    const [user_id, setUserId] = useState<number>();
    const [cart, setCart] = useState<Product[]>([]);
    const [cartSum, setCartSum] = useState<number>(0);
    const [cartShipping, setCartShipping] = useState<number>(0);
    const [imageURL, setImageURL] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showCartDropdown, setShowCartDropdown] = useState<boolean>(false);

    useEffect(() => {
        const form_data = new FormData();
        apiCall({ url: "/api/user/current/", method: "POST", data: form_data })
            .then(data => {
                const image_url = data["image_url"];
                const user_id = data["user"];
                setUserId(user_id);
                setCart(data["cart"]);
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
            let dropdownElement = document.querySelector("#cart-dropdown") as HTMLDivElement;
            let dropdownContent = document.querySelector("#cart-dropdown-content") as HTMLDivElement;
            if (dropdownElement.contains(div) && !dropdownContent.contains(div)) setShowCartDropdown(!showCartDropdown);
            else if (!dropdownElement.contains(div) && !dropdownContent.contains(div)) setShowCartDropdown(false);

            dropdownElement = document.querySelector("#profile-dropdown") as HTMLDivElement;
            dropdownContent = document.querySelector("#profile-dropdown-content") as HTMLDivElement;
            if (dropdownElement.contains(div) && !dropdownContent.contains(div)) setShowDropdown(!showDropdown);
            else if (!dropdownElement.contains(div) && !dropdownContent.contains(div)) setShowDropdown(false);

            // if (div.className.includes("dropdown-activate")) setShowDropdown(!showDropdown);
            // else if (!div.className.includes("dropdown-active")) setShowDropdown(false);
            // console.log(div.className);
        } catch (e) {}
    };

    useEffect(() => {
        // @ts-ignore
        document.addEventListener("click", Click);
        // @ts-ignore
        return () => document.removeEventListener("click", Click);
    });

    useEffect(() => {
        let sum = 0;
        let shippingSum = 0;
        cart.forEach((object: Product) => {
            sum += object.price;
            shippingSum += object.shipping_price;
        });
        setCartSum(sum);
        setCartShipping(shippingSum);
    }, [cart]);

    const RemoveFromCart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const form_data = new FormData();
        const div = e.currentTarget as HTMLDivElement;
        const id = div.id.split("-")[1];
        form_data.append("item", id);
        apiCall({ url: "/api/cart/remove/", method: "POST", data: form_data })
            .then(response => {
                if (response && response.ok) {
                    setCart(cart => {
                        return cart.filter(product => {
                            return product.id !== Number(id);
                        });
                    });
                    return response.json();
                }
                throw response;
            })
            .then(data => {})
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    return (
        <div className="navbar-container">
            <Link to="/" id="home-button" className="nav-button">
                <AiOutlineShop className="logo" size="50" />
            </Link>
            <div className="left-nav">
                <ProductCreateModal />
                <div className="dropdown nav-button" id="cart-dropdown">
                    <BsCart4 />
                    <div id="cart-dropdown-content" className={showCartDropdown ? "" : "hidden"}>
                        {cart.map((object: Product) => {
                            return (
                                <div className="product_container">
                                    <ProductComponent product={object} size={1} />
                                    <div className="remove_cart" onClick={RemoveFromCart} id={"item-" + object.id}>
                                        x
                                    </div>
                                </div>
                            );
                        })}
                        <div className="cart-sum">
                            <div>Product price: {cartSum}</div>
                            <div>Shipping price: {cartShipping}</div>
                            <div>Total price: {cartSum + cartShipping}</div>
                        </div>
                        <Link to="/checkout/">
                            <div className="cart-checkout-button">Go to checkout</div>
                        </Link>
                    </div>
                </div>
                <div className="dropdown-container nav-button" id="profile-dropdown">
                    <img src={imageURL} />
                    <div id="profile-dropdown-content" className={showDropdown ? "" : "hidden"}>
                        <div>
                            <a href={"/#/profile/" + user_id} className="nav-profile">
                                Profile
                            </a>
                            <a href="/#/orders" className="nav-settings">
                                Orders
                            </a>
                        </div>
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
