import React, { useState, useEffect } from "react";

import Product from "../../interfaces/product";
import getData from "../../functions/getData";

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

import "./productlist.css";

interface Props {
    category?: number;
    owner?: number;
}

const ProductList = (props: Props) => {
    const [productsCount, setProductsCount] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [url, setURL] = useState<string>("");

    const [size, setSize] = useState<number>(25);
    const [page, setPage] = useState<number>(1);
    const [sort, setSort] = useState<string>("");
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);

    const combineQueryParams = () => {
        let url = "/api/product/list/";

        url += "?size=" + size;
        if (sort) {
            url += "&sort=" + sort;
        }
        if (props.category) {
            url += "&category=" + props.category;
        }
        if (props.owner) {
            url += "&owner=" + props.owner;
        }
        if (minPrice) {
            url += "&min-price=" + minPrice;
        }

        if (maxPrice) {
            url += "&max-price=" + maxPrice;
        }
        if (page) {
            url += "&page=" + page;
        }
        return url;
    };

    useEffect(() => {
        setPage(1);
        setURL(combineQueryParams);
    }, [props.category, size, sort, minPrice, maxPrice]);

    useEffect(() => {
        setURL(combineQueryParams());
    }, [page]);

    useEffect(() => {
        getData({ url: url }).then(response => {
            setProductsCount(response["count"]);
            setProducts(response["results"]);
        });
    }, [url]);

    const changeSize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const div = e.currentTarget as HTMLDivElement;
        const id = div.id.split("-")[1];
        setSize(Number(id));
    };

    const changePageLeft = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const changePageRight = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (page < productsCount / size) {
            setPage(page + 1);
        }
    };

    return (
        <div>
            <div className="filters-container">
                <div className="sort-select">
                    <span>Sorting</span>
                    <select name="sort" id="sort-select" onChange={e => setSort(e.target.value)}>
                        <option selected disabled hidden>
                            None
                        </option>
                        <option value="price_ascending">Price: ascending</option>
                        <option value="price_descending">Price: descending</option>
                        <option value="name_ascending">Name: ascending</option>
                        <option value="name_descending">Name: descending</option>
                        <option value="oldest">Date: newest</option>
                        <option value="oldest">Date: newest</option>
                    </select>
                </div>
                <div className="size-filters">
                    <span id="size-10" onClick={changeSize}>
                        10
                    </span>
                    <span id="size-25" onClick={changeSize}>
                        25
                    </span>
                    <span id="size-50" onClick={changeSize}>
                        50
                    </span>
                    <label>Price </label>
                    <input
                        type="text"
                        className="price-range"
                        placeholder="from"
                        onChange={e => setMinPrice(Number(e.target.value))}
                    />
                    -
                    <input
                        type="text"
                        className="price-range"
                        placeholder="to"
                        onChange={e => setMaxPrice(Number(e.target.value))}
                    />
                </div>
                <div className="pages">
                    <div onClick={changePageLeft}>
                        <MdOutlineKeyboardArrowLeft id="left-page-arrow" />
                    </div>
                    {size * (page - 1) + 1}-{size * page}
                    <div onClick={changePageRight}>
                        <MdOutlineKeyboardArrowRight id="right-page-arrow" />
                    </div>
                    of {productsCount}
                </div>
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
                            <img src={object.image_url} className="prevent-select" />
                            <span>{name}</span>
                            <div>Price: {price} zł</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductList;
