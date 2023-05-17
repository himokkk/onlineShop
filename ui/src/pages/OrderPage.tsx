import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import Order from "../interfaces/order";
import getData from "../functions/getData";
const OrderPage: React.FC = () => {
    const { id } = useParams();
    const [ order, setOrder ] = useState<Order>();

    useEffect(() => {
        getData({ url: "api/order/" + id })
            .then(response => {
                if (response && response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {setOrder(data);})
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <div>xx</div>
    )
}

export default OrderPage;