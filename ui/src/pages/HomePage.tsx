import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import getData from "../functions/getData";
import Category from "../interfaces/category";
import Product from "../interfaces/product";

import "../css/home.css";

const HomePage: React.FC = () => {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<number>();
    const [products, setProducts] = useState<Product[]>([]);

    const [size, setSize] = useState<number>(25);

    useEffect(() => {
        if (!cookies.get("token")) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        getData({ url: "/api/category/list/" }).then(response => {
            setCategories(response);
        });
    }, []);

    useEffect(() => {
        let url = "/api/product/list/";
        url += "?size=" + size;
        if (category) {
            url += "&category=" + category;
        }
        getData({ url: url }).then(response => {
            setProducts(response);
        });
    }, [category]);

    const changeCategory = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const div = event.currentTarget as HTMLDivElement;
        const id = div.id.split("-")[1];
        setCategory(Number(id));
    };

    return (
        <div className="container">
            <NavBar />
            <div className="categories-container">
                {categories.map((object: Category) => {
                    return (
                        <div className="category" id={"category-" + object.id} onClick={changeCategory}>
                            <img src={object.svg_url} className="category-image" />
                            <div className="category-text">{object.name}</div>
                        </div>
                    );
                })}
            </div>
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
                            <img src={object.image_url} className="product-image" />
                            <div className="product-name">{name}</div>
                            <div className="product-price">Price: {price} zł</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HomePage;
