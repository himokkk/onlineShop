import Cookies from "universal-cookie";

interface Props {
    url: string;
    div?: HTMLDivElement;
    setActiveSpinner?: Function;
}

let getData = async (props: Props) => {
    const cookies = new Cookies();
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
            Authorization: cookies.get("token"),
        },
    }).then(response => response.json());
    if (props.setActiveSpinner) props.setActiveSpinner(false);
    if (props.div) {
        props.div.classList.remove("animate-spin");
        props.div.classList.add("hidden");
    }
    return response;
};

export default getData;
