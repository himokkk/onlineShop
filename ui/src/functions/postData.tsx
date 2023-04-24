import { SetStateAction } from "react";
import getCookie from "../functions/getCookie";

interface Props {
    url: string;
    div?: HTMLDivElement;
    data?: FormData;
    setActiveSpinner?: Function;
}

let postData = async (props: Props) => {
    if (props.url.includes("null")) {
        return;
    }

    const csrftoken = getCookie("csrftoken") as string;
    let response = await fetch(props.url, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrftoken,
        },
        body: props.data,
    }).then(response => {
        return response;
    });
    if (props.setActiveSpinner) props.setActiveSpinner(false);
    return response;
};

export default postData;
