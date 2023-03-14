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
import ProductsList from "../components/ProductsListComponent/ProductsList";

import "../css/home.css";

const HomePage: React.FC = () => {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<number>();

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

    const changeCategory = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const div = event.currentTarget as HTMLDivElement;
        const id = div.id.split("-")[1];
        setCategory(Number(id));
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
        <div className="home-container">
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

            <ProductsList category={category} />
        </div>
    );
};

export default HomePage;
