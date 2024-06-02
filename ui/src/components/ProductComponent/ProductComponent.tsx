import React from "react";
import { Link } from "react-router-dom";

import Product from "../../interfaces/product";
import "./product.css";

interface Props {
    product: Product;
    size: number;
}

const ProductComponent = (props: Props) => {
    let price = String(props.product.price);
    if (price.length > 8) {
        price = price.slice(0, 8);
    }
    let shipping_price = String(props.product.shipping_price);
    if (shipping_price.length > 8) {
        shipping_price = shipping_price.slice(0, 8);
    }

    return (
        <Link to={"/product/" + props.product.id} className={"product product-" + props.size}>
            <img src={props.product.image_url} className="prevent-select" />
            <div>
                <div className="product-name">{props.product.name}</div>
            </div>
            <div className="right-container">
                {props.size != 0 ? <div>Price: {price} zł</div> : null}
                {props.size != 0 ? <div>Shipping price: {shipping_price} zł</div> : null}
                {props.size != 0 ? <div>Total price: {Number(price) + Number(shipping_price)} zł</div> : null}
            </div>
        </Link>
    );
};

export default ProductComponent;
