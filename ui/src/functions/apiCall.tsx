import { SetStateAction } from "react";
import getCookie from "../functions/getCookie";
import Cookies from "universal-cookie";
import * as repl from "repl";

interface Props {
    url: string;
    div?: HTMLDivElement;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: FormData;
    setActiveSpinner?: Function;
    verify?: boolean;
}

let apiCall = async (props: Props) => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    if (props.url.includes("null")) {
        return;
    }
    const headers = new Headers();
    const csrftoken = getCookie("csrftoken") as string;
    headers.append("contentType", 'application/json');
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
    if (response.code == "token_not_valid") {
        cookies.remove("token")
        const data = new FormData();
        console.log("alll cookies", cookies.getAll());

        console.log("refhres ", cookies.get("refresh"))
        response = await fetch("http://localhost:8000/users/login/refresh/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({"refresh": cookies.get("refresh")}),
        }).then(response => {
            return response.json();
        });
        console.log("new token: ", response["token"]);
        cookies.set("token", response["token"]);
        headers.set("Authorization", `Bearer ${response["token"]}`);

        response = await fetch(props.url, {
            method: props.method,
            headers: headers,
            body: props.data,
        }).then(response => {
            return response.json();
        });
    }
    if (props.setActiveSpinner) props.setActiveSpinner(false);
    return response;
};

export default apiCall;
