import { RefObject } from "react";

const closeModal = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
        const modal = ref.current as HTMLDivElement;
        modal.style.display = "none";
    }
};

export default closeModal;
