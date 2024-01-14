import React, { useState, useEffect, useRef } from "react";

import Category from "../../interfaces/category";

import InputField from "../InputFieldComponent/InputField";
import SubmitButton from "../SubmitButtonComponent/SubmitButton";
import TextArea from "../TextAreaComponent/TextArea";
import FileInput from "../FileInputComponent/FileInput";

import Select from "../SelectComponent/Select";
import product_svg from "./product.svg";

import { IoMdPricetag } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { MdProductionQuantityLimits } from "react-icons/md";

import "./productmodal.css";
import apiCall from "../../functions/apiCall";
import Product from "../../interfaces/product";
import CategoryCreateModal from "../CategoryCreateModalComponent/CategoryCreateModal";
import backendConfig from "../../urls";

const ProductCreateModal = () => {
    const modalRef = useRef(null);
    const errorRef = useRef(null);
    const productForm = useRef(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        apiCall({ url: backendConfig.categories_list, method: "GET" }).then(response => {
            setCategories(response);
        });
    }, []);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (productForm.current) {
            let form_data = new FormData(productForm.current);

            apiCall({url: backendConfig.product_create, method: "POST", data: form_data})
                .then(data => {
                    if (data["id"]) setIsVisible(false);
                    else if (errorRef.current) (errorRef.current as HTMLElement).innerHTML = "Error";
                })
        }
    };

    return (
        <div className="modal_main">
            <div onClick={() => setIsVisible(true)} className="add_product_button">
                Add Product
            </div>
            {isVisible ? (
                <div className="modal" ref={modalRef}>
                    <div className="modal_content prevent-select">
                        <span className="modal_close" onClick={() => setIsVisible(false)}>
                            &times;
                        </span>
                        <img src={product_svg} alt="product_photo" className="prevent-select" />
                        <span ref={errorRef}>Create a Product!</span>
                        <form ref={productForm} onSubmit={SubmitForm}>
                            <InputField
                                id="product-input"
                                name="name"
                                placeholder="Product Name"
                                label="Product Name"
                                required={true}
                                icon={MdProductionQuantityLimits}
                            />
                            <InputField
                                id="product-price-input"
                                name="price"
                                placeholder="Price"
                                label="Price"
                                required={true}
                                icon={IoMdPricetag}
                            />
                            <InputField
                                id="product-shipping-price-input"
                                name="shipping_price"
                                placeholder="Shipping Price"
                                label="Shipping Price"
                                required={true}
                                icon={IoMdPricetag}
                            />
                            <Select
                                options={categories}
                                name="category"
                                id="category-select"
                                label="Category"
                                default="Select a category"
                                icon={BiCategory}
                            />
                            <FileInput name="image" label="Image" required={true} accept=".jpg, .jpeg, .png" />
                            <TextArea name="description" label="Product Description" placeholder="Description" />
                            <SubmitButton name="Create Product" />
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ProductCreateModal;
