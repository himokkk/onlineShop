import React, { useState, useEffect } from "react";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BiSortZA } from "react-icons/bi";

import Product from "../../interfaces/product";
import selectInterface from "../SelectComponent/selectInterface";
import LoadingSpinner from "../LoadingSpinnerComponent/LoadingSpinner";
import Select from "../SelectComponent/Select";
import InputField from "../InputFieldComponent/InputField";
import ProductComponent from "../ProductComponent/ProductComponent";

import "./productlist.css";
import ReviewCreateModal from "../ReviewCreateModalComponent/ReviewCreateModal";
import apiCall from "../../functions/apiCall";
import backendConfig from "../../urls";

interface Props {
    category?: number;
    owner?: number;
    defaultSize?: number;
    productsSize?: number;
    products?: Product[];
    canBeReviewed?: boolean;
    bars?: boolean;
}

const ProductList = (props: Props) => {
    const [spinnerActive, setSpinnerActive] = useState<boolean>(true);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [url, setURL] = useState<string>("");

    const [size, setSize] = useState<number>(props.defaultSize ? props.defaultSize : 25);
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
        let url = backendConfig.products_list;

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
        if (props.products) {
            setProducts(props.products);
            setSpinnerActive(false);
            return;
        }
        apiCall({ url: url, method: "GET"}).then(data => {
            setSpinnerActive(false);
            if (data["results"]) {
                setProductsCount(data["count"]);
                setProducts(data["results"]);
            return;
        }
        });
    }, [url]);

    useEffect(() => {
        switch (priceOption) {
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
            {props.bars ? null : (
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
            )}
            <div className="products_container">
                {props.bars ? null : (
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
                                <input type="checkbox" checked={priceOption === 1} onChange={() => setPriceOption(1)} />
                                under 10 zł
                            </div>
                            <div>
                                <input type="checkbox" checked={priceOption === 2} onChange={() => setPriceOption(2)} />
                                10zł to 15zł
                            </div>
                            <div>
                                <input type="checkbox" checked={priceOption === 3} onChange={() => setPriceOption(3)} />
                                15zł to 25zł
                            </div>
                            <div>
                                <input type="checkbox" checked={priceOption === 4} onChange={() => setPriceOption(4)} />
                                25zł to 35zł
                            </div>
                            <div>
                                <input type="checkbox" checked={priceOption === 5} onChange={() => setPriceOption(5)} />
                                35zł and above
                            </div>
                            <div className="price_inputs">
                                <InputField
                                    id="min_price"
                                    placeholder="min price"
                                    label="Min Price"
                                    onChange={setMinPrice}
                                />
                                <span>-</span>
                                <InputField
                                    id="max_price"
                                    placeholder="max price"
                                    label="Max Price"
                                    onChange={setMaxPrice}
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div className="products-container">
                    {spinnerActive ? <LoadingSpinner /> : null}
                    {products.map((object: Product) => {
                        if (!props.canBeReviewed || object.has_review)
                            return (
                                <ProductComponent product={object} size={props.productsSize ? props.productsSize : 4} />
                            );
                        else
                            return (
                                <div>
                                    <ProductComponent
                                        product={object}
                                        size={props.productsSize ? props.productsSize : 4}
                                    />
                                    <ReviewCreateModal product_id={object.id} />
                                </div>
                            );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
