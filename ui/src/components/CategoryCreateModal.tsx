import React, { useState, useEffect, useRef} from "react";

import getCookie from "../functions/getCookie";
import getData from "../functions/getData";
import Category from "../interfaces/category";

const CategoryCreateModal = () => {
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
            
            fetch("/api/category/create/", {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrftoken,
                },
                body: form_data,
                }).then((response) => {
                    if(response.ok) closeModal();
                    else if (errorRef.current)  (errorRef.current as HTMLElement).innerHTML = "Error";
            });
        }        
    };

    const showModal = (() => {
        if(modalRef.current) {
            const modal = modalRef.current as HTMLDivElement;
            modal.style.display = "flex";
        }
    });

    const closeModal = (() => {
        if(modalRef.current) {
            const modal = modalRef.current as HTMLDivElement;
            modal.style.display = "none";
        }
    });

    return (
        <div className="modal_main">
            <div onClick={showModal}>&#43;</div>
            <div className="modal" ref={modalRef}>
                    <div className="modal_content">
                        <span className="modal_close" onClick={closeModal}>&times;</span>
                        <span ref={errorRef}>Create a Category!</span>
                        <form ref={productForm} onSubmit={SubmitForm}>
                            <input type="text" id="name" name="name" placeholder="Name" required />
                            <input type="file" id="svg" name="svg" accept=".svg" />
                            <button type="submit">
                                Create Category
                            </button>
                        </form>
                    </div>
            </div>
        </div>
    );
};

export default CategoryCreateModal;