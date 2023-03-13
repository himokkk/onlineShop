import React, { useState, useEffect } from "react";

import Product from "../../interfaces/product";
import getData from "../../functions/getData";

import "./productlist.css";

interface Props {
    url: string;
    setCount: Function;
}

const ProductList = (props: Props) => {
    const [productsCount, setProductsCount] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        getData({ url: props.url }).then(response => {
            props.setCount(response["count"]);
            setProducts(response["results"]);
        });
    }, [props.url, props.setCount]);

    return (
        <div className="products-container">
            {products.map((object: Product) => {
                let name = object.name;
                if (name.length > 18) {
                    name = name.slice(0, 15);
                    name += "...";
                }
                let price = String(object.price);
                if (price.length > 18) {
                    price = price.slice(0, 10);
                    price += "...";
                }
                return (
                    <div className="product" id={"product-" + object.id}>
                        <img src={object.image_url} className="prevent-select" />
                        <span>{name}</span>
                        <div>Price: {price} zł</div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductList;
