import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import styles from "../styles/Messages.module.css";

function MessagesContainer() {
    const { socket, messages, roomId, userName, setMessages } = useSockets();
    const newMessageRef = useRef(null);
    const messageEndRef = useRef(null);

    function handleSendMessage() {
        const message = newMessageRef.current.value;

        if (!String(message).trim()) {
            return;
        }

        socket?.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
            roomId,
            message,
            userName,
        });

        const date = new Date();

        setMessages([
            ...messages,
            {
                userName: "You",
                message,
                time: `${date.getHours()} : ${date.getMinutes()}`,
            },
        ]);

        newMessageRef.current.value = "";
    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!roomId) {
        return <div />;
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.messageList}>
                {messages.map(({ message, userName, time }, index) => {
                    return (
                        <>
                            <div className={styles.message} key={index}>
                                <div
                                    className={styles.messageInner}
                                    key={index}
                                >
                                    <span className={styles.messageSender}>
                                        {userName} - {time}
                                    </span>
                                    <span className={styles.messageBody}>
                                        {message}
                                    </span>
                                </div>
                            </div>
                        </>
                    );
                })}
                <div ref={messageEndRef}></div>
            </div>
            <div className={styles.messageBox}>
                <textarea
                    rows={1}
                    placeholder="Tell us what you are thinking"
                    ref={newMessageRef}
                ></textarea>

                <button onClick={handleSendMessage}>SEND</button>
            </div>
        </div>
    );
}

export default MessagesContainer;
