import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import postData from "../functions/postData";
import "../css/orders.css";

import Order from "../interfaces/order";

const OrdersListPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get("token");
        const form_data = new FormData();
        form_data.append("token", token);

        postData({ url: "/api/order/list/", data: form_data })
            .then(response => {
                if (response && response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {setOrders(data);})
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <div className="orders_container">
            <div className="orders_content">
                {orders.map((object: Order) => {
                    return (
                        <div className="order">{object.id}</div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrdersListPage;
