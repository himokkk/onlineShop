import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import apiCall from "../functions/apiCall";
import "../css/orders.css";

import Order from "../interfaces/order";
import StatusChangeModal from "../components/StatusChangeModalComponent/StatusChangeModal";
import "../css/orderslist.css";
import NavBar from "../components/NavBarComponent/NavBar";
import backendConfig from "../urls";

const OrdersListPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [status, setStatus] = useState<string>("waiting for payment");
    const cookies = new Cookies();
    const navigate = useNavigate();
    useEffect(() => {
        if (!cookies.get("token")) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        const form_data = new FormData();
        let url = backendConfig.orders_list + "?status=" + status;
        apiCall({ url: url, method: "POST", data: form_data })
            .then(response => {
                if (response && response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                setOrders(data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [status]);

    return (
        <div>
            <NavBar />
            <div className="orders_container">
                <div className="orders_content">
                    <div className="status_change_buttons_container prevent-select">
                        <div
                            className={
                                status === "waiting for payment"
                                    ? "orange_button status_change_button"
                                    : "status_change_button"
                            }
                            onClick={() => setStatus("waiting for payment")}
                        >
                            Not paid
                        </div>
                        <div
                            onClick={() => setStatus("paid")}
                            className={
                                status === "paid" ? "orange_button status_change_button" : "status_change_button"
                            }
                        >
                            Paid
                        </div>
                        <div
                            className={
                                status === "sent" ? "orange_button status_change_button" : "status_change_button"
                            }
                            onClick={() => setStatus("sent")}
                        >
                            Sent
                        </div>
                        <div
                            className={
                                status === "delivered" ? "orange_button status_change_button" : "status_change_button"
                            }
                            onClick={() => setStatus("delivered")}
                        >
                            Delivered
                        </div>
                    </div>
                    <div className="orders_list">
                        {orders.map((object: Order) => {
                            return (
                                <div className="order_container">
                                    <Link to={"/order/" + object.id} className="link">
                                        <div className="order">Order #{object.id} </div>
                                        <div className="status">Status: {object.status}</div>
                                    </Link>
                                    <div>
                                        {object.status === "paid" ? <StatusChangeModal id={object.id} /> : null}
                                        {object.status === "waiting for payment" ? (
                                            <Link to={"/pay/" + object.id}>
                                                <div className="change_status prevent-select">Pay</div>
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersListPage;
