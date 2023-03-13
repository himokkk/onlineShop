import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

import NavBar from "../components/NavBarComponent/NavBar";
import ProductCreateModal from "../components/ProductCreateModalComponent/ProductCreateModal";
import CategoryCreateModal from "../components/CategoryCreateModalComponent/CategoryCreateModal";
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
    const [productsCount, setProductsCount] = useState<number>(0);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [sort, setSort] = useState<string>("");

    useEffect(() => {
        if (!cookies.get("token")) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        const allCategory: Category = {
            id: 0,
            name: "All",
            svg_url: "0",
        };
        getData({ url: "/api/category/list/" }).then(response => {
            setCategories(() => [allCategory, ...response]);
        });
    }, []);

    useEffect(() => {
        let url = "/api/product/list/";
        url += "?size=" + size;
        if (sort) {
            url += "&sort=" + sort;
        }
        if (category) {
            url += "&category=" + category;
        }

        if (minPrice) {
            url += "&min-price=" + minPrice;
        }

        if (maxPrice) {
            url += "&max-price=" + maxPrice;
        }

        setPage(1);
        getData({ url: url }).then(response => {
            setProductsCount(response["count"]);
            setProducts(response["results"]);
        });
    }, [category, size, sort, minPrice, maxPrice]);

    useEffect(() => {
        if (page === 1) return;
        let url = "/api/product/list/";
        url += "?size=" + size;
        if (sort) {
            url += "&sort=" + sort;
        }
        if (category) {
            url += "&category=" + category;
        }

        url += "&page=" + page;

        getData({ url: url }).then(response => {
            setProductsCount(response["count"]);
            setProducts(response["results"]);
        });
    }, [page]);

    const changeCategory = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const div = event.currentTarget as HTMLDivElement;
        const id = div.id.split("-")[1];
        setCategory(Number(id));
    };

    const changeSize = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const div = event.currentTarget as HTMLDivElement;
        const id = div.id.split("-")[1];
        setSize(Number(id));
    };

    const changePageLeft = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const changePageRight = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (page < productsCount / size) {
            setPage(page + 1);
        }
    };

    useEffect(() => {
        const slider = document.querySelector(".categories-container") as HTMLDivElement;
        let isDown = false;
        let startX: number;
        let scrollLeft: number;

        slider.addEventListener("mousedown", e => {
            isDown = true;
            slider.classList.add("active");
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener("mouseleave", () => {
            isDown = false;
            slider.classList.remove("active");
        });
        slider.addEventListener("mouseup", () => {
            isDown = false;
            slider.classList.remove("active");
        });
        slider.addEventListener("mousemove", e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3;
            slider.scrollLeft = scrollLeft - walk;
        });
    }, []);

    return (
        <div className="container">
            <NavBar />
            <ProductCreateModal />
            <CategoryCreateModal />
            <div className="categories-border">
                <MdOutlineKeyboardArrowLeft id="left-categories-arrow" />
                <div className="categories-container">
                    {categories.map((object: Category) => {
                        if (object.name === "All") {
                            return (
                                <div
                                    className="category prevent-select"
                                    id={"category-" + object.id}
                                    onClick={changeCategory}
                                >
                                    <span>{object.name}</span>
                                </div>
                            );
                        }
                        return (
                            <div
                                className="category prevent-select"
                                id={"category-" + object.id}
                                onClick={changeCategory}
                            >
                                <img src={object.svg_url} />
                            </div>
                        );
                    })}
                </div>
                <MdOutlineKeyboardArrowRight id="right-categories-arrow" />
            </div>
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

export default HomePage;
