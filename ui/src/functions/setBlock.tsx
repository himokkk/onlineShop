import { RefObject } from "react";

const setBlock = (ref: RefObject<HTMLDivElement>) => {
    const div = ref.current as HTMLDivElement;
    div.style.display = "block";
};

export default setBlock;