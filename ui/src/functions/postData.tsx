import getCookie from "../functions/getCookie";

interface Props {
    url: string;
    div?: HTMLDivElement;
    data?: {};
}

let getData = async (props: Props) => {
    if (props.div) {
        props.div.classList.remove("hidden");
        props.div.classList.add("animate-spin");
    }
    if (props.url.includes("null")) {
        return;
    }
    const csrftoken = getCookie("csrftoken") as string;
    let response = await fetch(props.url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(props.data),
    }).then((response) => {
        return response.json();
    });
    if (props.div) {
        props.div.classList.remove("animate-spin");
        props.div.classList.add("hidden");
    }
    return response;
};

export default getData;
