interface Props {
    url: string;
    div?: HTMLDivElement;
}

let getData = async (props: Props) => {
    if (props.div) {
        props.div.classList.remove("hidden");
        props.div.classList.add("animate-spin");
    }
    if (props.url.includes("null")) {
        return;
    }
    let response = await fetch(props.url, {
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json());
    if (props.div) {
        props.div.classList.remove("animate-spin");
        props.div.classList.add("hidden");
    }
    return response;
};

export default getData;
