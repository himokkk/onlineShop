import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BiSortZA } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";

import Product from "../../interfaces/product";
import getData from "../../functions/getData";
import selectInterface from "../SelectComponent/selectInterface";
import LoadingSpinner from "../LoadingSpinnerComponent/LoadingSpinner";
import Select from "../SelectComponent/Select";
import InputField from "../InputFieldComponent/InputField";

import "./productlist.css";

interface Props {
    category?: number;
    owner?: number;
}

const ProductList = (props: Props) => {
    const [spinnerActive, setSpinnerActive] = useState<boolean>(true);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [url, setURL] = useState<string>("");

    const [size, setSize] = useState<number>(25);
    const [page, setPage] = useState<number>(1);
    const [sort, setSort] = useState<string>("");
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [priceOption, setPriceOption] = useState<number>(0);

    const sortSelect: selectInterface[] = [
        { id: "price_ascending", name: "Price: ascending" },
        { id: "price_descending", name: "Price: descending" },
        { id: "name_ascending", name: "Name: ascending" },
        { id: "name_descending", name: "Name: descending" },
        { id: "oldest", name: "Date: newest" },
        { id: "newest", name: "Date: newest" },
    ];

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
            setSpinnerActive(false);
            setProductsCount(response["count"]);
            setProducts(response["results"]);
        });
    }, [url]);

    useEffect(() => {
        switch(priceOption) {
            case 1:
                setMinPrice(0);
                setMaxPrice(10);
                break;
            case 2:
                setMinPrice(10);
                setMaxPrice(15);
                break;
            case 3:
                setMinPrice(15);
                setMaxPrice(25);
                break;
            case 4:
                setMinPrice(25);
                setMaxPrice(35);
                break;
            case 5:
                setMinPrice(35);
                setMaxPrice(0);
                break;
        }
        
    }, [priceOption]);

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
        <div className="products-main">
            <div className="sorting_container">
                <div className="size-filters">
                    <label>Page Size</label>
                    <span id="size-10" onClick={changeSize}>
                        10
                    </span>
                    <span id="size-25" onClick={changeSize}>
                        25
                    </span>
                    <span id="size-50" onClick={changeSize}>
                        50
                    </span>
                </div>
                <div className="pages">
                    <div onClick={changePageLeft}>
                        <MdOutlineKeyboardArrowLeft id="left-page-arrow" />
                    </div>
                    {size * (page - 1) + 1}-{size * page > productsCount ? productsCount : size * page}
                    <div onClick={changePageRight}>
                        <MdOutlineKeyboardArrowRight id="right-page-arrow" />
                    </div>
                    of {productsCount}
                </div>
            </div>
            <div className="products_container">
                <div className="filters-container">
                    <Select
                        id="sorting-select"
                        default="Choose sorting"
                        setFunction={setSort}
                        label="Sorting"
                        options={sortSelect}
                        name="sort"
                        icon={BiSortZA}
                    />
                    <div className="price-sort">
                        <div>
                            <input type="checkbox" checked={priceOption === 1}
                                onChange={() => setPriceOption(1)}/>
                            under 10 zł
                        </div>
                        <div>
                            <input type="checkbox" checked={priceOption === 2}
                                onChange={() => setPriceOption(2)}/>
                            10zł to 15zł
                        </div>
                        <div>
                            <input type="checkbox" checked={priceOption === 3}
                                onChange={() => setPriceOption(3)}/>
                            15zł to 25zł
                        </div>
                        <div>
                            <input type="checkbox" checked={priceOption === 4}
                                onChange={() => setPriceOption(4)}/>
                            25zł to 35zł
                        </div>
                        <div>
                            <input type="checkbox" checked={priceOption === 5}
                                onChange={() => setPriceOption(5)}/>
                            35zł and above
                        </div>
                        <div className="price_inputs">
                            <InputField id="min_price" placeholder="min price" label="Min Price" onChange={setMinPrice} />
                            <span>-</span>
                            <InputField id="max_price" placeholder="max price" label="Max Price" onChange={setMaxPrice} />
                        </div>
                    </div>
                    
                </div>
                <div className="products-container">
                    {spinnerActive ? <LoadingSpinner /> : <div></div>}
                    {products.map((object: Product) => {
                        let price = String(object.price);
                        if (price.length > 8) {
                            price = price.slice(0, 8);
                        }
                        let shipping_price = String(object.shipping_price);
                        if (shipping_price.length > 8) {
                            shipping_price = shipping_price.slice(0, 8);
                        }
                        return (
                            <Link to={"/product/" + object.id} className="product">
                                <div>
                                    <img src={object.image_url} className="prevent-select" />
                                    <div>
                                        <div className="product-name">{object.name}</div>
                                        4.8 
                                        <AiFillStar fill="#fb923c"/>
                                        <AiFillStar fill="#fb923c"/>
                                        <AiFillStar fill="#fb923c"/>
                                        <AiFillStar fill="#fb923c"/>
                                        <AiFillStar fill="#fb923c"/>
                                        10 reviews
                                        <div>{object.description}</div>
                                    </div>
                                </div>
                                <div className="right-container">
                                    <div>Price: {price} zł</div>
                                    <div>Shipping price: {shipping_price} zł</div>
                                    <div>Total price: {Number(price) + Number(shipping_price)} zł</div>
                                    <div className="people_bought">0 people bought</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
