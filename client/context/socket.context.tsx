import { createContext, useContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";
import EVENTS from "../config/events";

interface Context {
    socket: Socket;
    userName?: string;
    setUserName: Function;
    messages?: { message: string; time: string; userName: string }[];
    setMessages: Function;
    roomId?: string;
    rooms: object;
}

const SocketContext = createContext<Context>({
    socket: null,
    setUserName: () => false,
    setMessages: () => false,
    rooms: {},
    messages: [],
});

function SocketProvider(props: any) {
    const [socket, setSocket] = useState(null);
    const [userName, setUserName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [rooms, setRooms] = useState({});
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        return () => {
            newSocket.close();
        };
    }, [setSocket]);

    useEffect(() => {
        window.onfocus = function () {
            document.title = "Chat app";
        };
    }, []);

    useEffect(() => {
        socket?.on(EVENTS.SERVER.ROOMS, (value) => {
            setRooms(value);
        });

        socket?.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
            setRoomId(value);

            setMessages([]);
        });

        socket?.on(
            EVENTS.SERVER.ROOM_MESSAGE,
            ({ message, username, time }) => {
                if (!document.hasFocus()) {
                    document.title = "New message...";
                }

                setMessages((messages) => [
                    ...messages,
                    { message, username, time },
                ]);
            }
        );

        return () => {
            socket?.off(SOCKET_URL);
        };
    }, [socket]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                userName,
                setUserName,
                rooms,
                roomId,
                messages,
                setMessages,
            }}
            {...props}
        />
    );
}

export const useSockets = () => useContext(SocketContext);

export default SocketProvider;
