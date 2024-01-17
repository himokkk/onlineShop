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
    const headers = new Headers();
    const csrftoken = getCookie("csrftoken") as string;
    headers.append("X-CSRFToken", csrftoken);
    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    let response = await fetch(props.url, {
        method: props.method,
        headers: headers,
        body: props.data,
    }).then(response => {
        return response.json();
    });
    if (props.setActiveSpinner) props.setActiveSpinner(false);
    return response;
};

export default apiCall;
