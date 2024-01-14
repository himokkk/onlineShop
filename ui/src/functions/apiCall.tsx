import { SetStateAction } from "react";
import getCookie from "../functions/getCookie";
import Cookies from "universal-cookie";

interface Props {
    url: string;
    div?: HTMLDivElement;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: FormData;
    setActiveSpinner?: Function;
}

let apiCall = async (props: Props) => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    if (props.url.includes("null")) {
        return;
    }
    const csrftoken = getCookie("csrftoken") as string;
    let response = await fetch(props.url, {
        method: props.method,
        headers: {
            "X-CSRFToken": csrftoken,
            Authorization: `Bearer ${token}`,
        },
        body: props.data,
    }).then(response => response.json());
    if (props.setActiveSpinner) props.setActiveSpinner(false);
    return response;
};

export default apiCall;
