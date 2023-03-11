import { MutableRefObject } from "react";

const resetErrors = ((errorRefs: MutableRefObject<null>[]) => {
    errorRefs.forEach(errorRef => {
        if(errorRef.current) {
            const div = errorRef.current as HTMLDivElement;
            div.style.display = "none";
        }
    });
});

export default resetErrors;