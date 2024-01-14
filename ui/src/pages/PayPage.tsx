import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import LoadingSpinner from "../components/LoadingSpinnerComponent/LoadingSpinner";
import "../css/pay.css";
import apiCall from "../functions/apiCall";

const PayPage: React.FC = () => {
    const { id } = useParams();
    const [payed, setPayed] = useState<boolean>(true);
    const [spinnerActive, setSpinnerActive] = useState<boolean>(true);

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.get("token")) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        apiCall({ url: "/api/order/" + id, method: "GET" }).then(response => {
            const payed = response["status"];
            if (payed == "waiting for payment") setPayed(false);
            setSpinnerActive(false);
        });
    }, []);

    const pay = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const data = new FormData();
        data.append("status", "paid");

        apiCall({url: "api/order/status/" + id, method: "PATCH", data: data})
            .then(response => {
                if (response && response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                setPayed(true);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    return (
        <div className="payment_container">
            {spinnerActive ? (
                <LoadingSpinner />
            ) : (
                <div className="payment_content">
                    {payed ? <span>Order #{id} payed</span> : <span>Order #{id} waiting for payment</span>}
                    <div className="payment_button">
                        {payed ? (
                            <div className="payed">
                                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                                <Link to="/" className="home_link">
                                    Go home
                                </Link>
                            </div>
                        ) : (
                            <div className="pay_button" onClick={pay}>
                                <span>pay!</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayPage;
