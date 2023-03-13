import React, { useState, useEffect, useRef } from "react";

import getCookie from "../functions/getCookie";
import getData from "../functions/getData";
import Category from "../interfaces/category";
import closeModal from "../functions/closeModal";
import showModal from "../functions/showModal";

import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

import product_svg from "./product.svg";

const ProductCreateModal = () => {
    const modalRef = useRef(null);
    const errorRef = useRef(null);
    const productForm = useRef(null);

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getData({ url: "/api/category/list/" }).then(response => {
            setCategories(response);
        });
    }, []);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (productForm.current) {
            let form_data = new FormData(productForm.current);
            const csrftoken = getCookie("csrftoken") as string;

            fetch("/api/product/create/", {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrftoken,
                },
                body: form_data,
            }).then(response => {
                if (response.ok) closeModal(modalRef);
                else if (errorRef.current) (errorRef.current as HTMLElement).innerHTML = "Error";
            });
        }
    };

    return (
        <div className="modal_main">
            <div onClick={() => showModal(modalRef)} className="pointer">
                &#43;
            </div>
            <div className="modal" ref={modalRef}>
                <div className="modal_content">
                    <span className="modal_close" onClick={() => closeModal(modalRef)}>
                        &times;
                    </span>
                    <img src={product_svg} alt="product_photo" />
                    <span ref={errorRef}>Create a Product!</span>
                    <form ref={productForm} onSubmit={SubmitForm}>
                        <InputField
                            id="product-input"
                            name="name"
                            placeholder="Product Name"
                            label="Product Name"
                            required={true}
                        />
                        <InputField
                            id="product-price-input"
                            name="price"
                            placeholder="Price"
                            label="Price"
                            required={true}
                        />
                        <div id="category-select">
                            <label htmlFor="category-select" className="category-select-label">
                                Category
                            </label>
                            <select name="category">
                                <option selected disabled hidden>
                                    Select a Category
                                </option>
                                {categories.map((object: Category) => {
                                    return (
                                        <option
                                            className="category prevent-select"
                                            value={object.id}
                                            id={"category-" + object.id}
                                        >
                                            {object.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="image-input">
                            <div>File</div>
                            <label htmlFor="image-input">Choose a file</label>
                            <input type="file" id="image-input" name="image" required />
                        </div>
                        <div className="textarea">
                            <label>Description</label>
                            <textarea rows={6} placeholder="Description" />
                        </div>
                        <SubmitButton name="Create Product" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductCreateModal;
