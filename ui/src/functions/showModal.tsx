import { RefObject } from "react";

const showModal = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
        const modal = ref.current as HTMLDivElement;
        modal.style.display = "flex";
    }
};

export default showModal;
