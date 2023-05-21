import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import getData from "../functions/getData";

import "../css/conversation.css";
import Message from "../interfaces/message";
import InputField from "../components/InputFieldComponent/InputField";
import SubmitButton from "../components/SubmitButtonComponent/SubmitButton";
import getCookie from "../functions/getCookie";
import Cookies from "universal-cookie";
import postData from "../functions/postData";
import NavBar from "../components/NavBarComponent/NavBar";

const ConversationPage: React.FC = () => {
    const { id } = useParams();
    const formRef = useRef(null);
    const cookies = new Cookies();

    const [messages, setMessages] = useState<Message[]>([]);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");

    useEffect(() => {
        getData({ url: "/api/user/" + id }).then(response => {
            setUsername(response["username"]);
            setDescription(response["description"]);
            setIsOwner(response["owner"]);

            const image_url = response["image_url"];
            if (image_url) {
                setImageURL(image_url);
            } else {
                setImageURL("media/profile/default.png");
            }
        });

        getData({ url: "/api/message/list/" + id }).then(response => {
            setMessages(response);
        });
    }, []);

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formRef.current) {
            let form_data = new FormData(formRef.current);
            if (id) {
                form_data.append("to_user", id);
            }

            postData({ url: "/api/message/create/", data: form_data })
                .then(response => {
                    if (response && response.ok) {
                        return response.json();
                    }
                    throw response;
                })
                .then(data => {
                    const inputElement = document.getElementById("send_message_input") as HTMLInputElement;
                    inputElement.value = "";
                    setMessages(messages => {
                        return [data, ...messages];
                    });
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        }
    };

    return (
        <div className="conversation_container">
            <NavBar />
            <div className="black_border">
                <div className="conversation_bar">
                    <img src={imageURL} className="prevent-select" />
                    <span>{username}</span>
                </div>
                <div className="conversation_content">
                    {messages.map((object: Message) => {
                        if (object.to_user === Number(id)) {
                            return (
                                <div className="message">
                                    <span className="right_message">{object.message}</span>
                                </div>
                            );
                        } else
                            return (
                                <div className="message">
                                    <span className="left_message">{object.message}</span>
                                </div>
                            );
                    })}
                </div>
                <form className="send_message_container" ref={formRef} onSubmit={SubmitForm}>
                    <div className="send_message_input">
                        <InputField placeholder="message" name="message" label="message" id="send_message_input" />
                    </div>
                    <SubmitButton name="Send!" id="send_message_button" />
                </form>
            </div>
        </div>
    );
};

export default ConversationPage;
