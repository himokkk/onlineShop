import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import postData from "../functions/postData";
import "../css/orders.css";

import Order from "../interfaces/order";
import StatusChangeModal from "../components/StatusChangeModalComponent/StatusChangeModal";
import "../css/orderslist.css";

const OrdersListPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [ isFinished, setIsFinished ] = useState<boolean>(false);
    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get("token");
        const form_data = new FormData();
        form_data.append("token", token);
        let url = "/api/order/list/?finised="+isFinished;
        postData({ url: url, data: form_data })
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
    }, [isFinished]);

    return (
        <div className="orders_container">
            <div className="orders_content">
                {orders.map((object: Order) => {
                    return (
                        <div className="order_container">
                            <Link to={"/order/" + object.id} className="link">
                                <div className="order">Order #{object.id} </div>
                                <div className="status">Status: {object.status}</div>
                            </Link>
                            { object.status === "paid" ? 
                                <StatusChangeModal id={object.id} /> : <div></div> }
                            { object.status === "waiting for payment" ? 
                                <Link to={"/pay/"+object.id}><div className="change_status">Pay</div></Link>
                                : <div></div> }
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrdersListPage;
