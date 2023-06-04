import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Order from "../interfaces/order";
import getData from "../functions/getData";
import ProductList from "../components/ProductsListComponent/ProductsList";
const OrderPage: React.FC = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        getData({ url: "api/order/" + id }).then(data => {
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
