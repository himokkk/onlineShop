import getCookie from "../functions/getCookie";

interface Props {
    url: string;
    div?: HTMLDivElement;
    data?: FormData;
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
            "X-CSRFToken": csrftoken,
        },
        body: props.data,
    }).then((response) => {
        return response;
    });
    if (props.div) {
        props.div.classList.remove("animate-spin");
        props.div.classList.add("hidden");
    }
    return response;
};

export default getData;
