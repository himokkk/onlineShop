import React, { useState, useEffect, useRef } from "react";

import getCookie from "../../functions/getCookie";

import closeModal from "../../functions/closeModal";
import showModal from "../../functions/showModal";

import InputField from "../InputFieldComponent/InputField";
import FileInput from "../FileInputComponent/FileInput";
import SubmitButton from "../SubmitButtonComponent/SubmitButton";

import { BiCategory } from "react-icons/bi";

import "./categorymodal.css";

const CategoryCreateModal = () => {
    const modalRef = useRef(null);
    const errorRef = useRef(null);
    const productForm = useRef(null);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (productForm.current) {
            let form_data = new FormData(productForm.current);
            const csrftoken = getCookie("csrftoken") as string;

            fetch("/api/category/create/", {
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
        </div>
    );
};

export default CategoryCreateModal;
