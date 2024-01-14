import React, { useState, useRef } from "react";

import getCookie from "../../functions/getCookie";

import InputField from "../InputFieldComponent/InputField";
import FileInput from "../FileInputComponent/FileInput";
import SubmitButton from "../SubmitButtonComponent/SubmitButton";

import { BiCategory } from "react-icons/bi";

import "./categorymodal.css";
import apiCall from "../../functions/apiCall";
import backendConfig from "../../urls";

const CategoryCreateModal = () => {
    const modalRef = useRef(null);
    const errorRef = useRef(null);
    const productForm = useRef(null);

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (productForm.current) {
            let data = new FormData(productForm.current);

            apiCall({url: backendConfig.categories_create, method: "POST", data: data})
                .then(response => {
                    if (response.ok) setIsVisible(false);
                    else if (errorRef.current) (errorRef.current as HTMLElement).innerHTML = "Error";
                });
        }
    };

    return (
        <div className="modal_main">
            <div onClick={() => setIsVisible(true)} className="pointer">
                &#43;
            </div>
            {isVisible ? (
                <div className="modal" ref={modalRef}>
                    <div className="modal_content">
                        <span className="modal_close" onClick={() => setIsVisible(false)}>
                            &times;
                        </span>

                        <span ref={errorRef}>Create a Category!</span>
                        <form ref={productForm} onSubmit={SubmitForm}>
                            <InputField
                                id="name-input"
                                name="name"
                                placeholder="Category Name"
                                label="Category Name"
                                required={true}
                                icon={BiCategory}
                            />
                            <FileInput name="svg" label="SVG Image" required={true} accept=".svg" />
                            <SubmitButton name="Create Category" id="category-create-button" />
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CategoryCreateModal;
