import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Order from "../interfaces/order";
import ProductList from "../components/ProductsListComponent/ProductsList";
import Cookies from "universal-cookie";
import apiCall from "../functions/apiCall";
import backendConfig from "../urls";
const OrderPage: React.FC = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>();

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.get("token")) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        apiCall({ url: backendConfig.order_by_id + id, method: "GET" }).then(data => {
            setOrder(data);
        });
    }, []);

    return (
        <div className="order__main">
            {order ? (
                <div className="order__container">
                    <h1>Order #{order.id}</h1>
                    <ProductList
                        canBeReviewed={true}
                        bars={true}
                        owner={Number(id)}
                        productsSize={1}
                        products={order.items}
                    />
                    <div className="cost">
                        <div>Total items price: {order.total_products_cost} zł</div>
                        <div>Total Shipping price: {order.total_shipping_cost} zł </div>
                        <div>Total price: {order.total_products_cost + order.total_shipping_cost} zł</div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default OrderPage;
