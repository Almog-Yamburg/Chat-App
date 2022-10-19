import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
    connection: "connection",
    CLIENT: {
        CREATE_ROOM: "CREATE_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM: "JOIN_ROOM",
    },
    SERVER: {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE",
    },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
    logger.info("Socket enabled");

    io.on(EVENTS.connection, (socket: Socket) => {
        logger.info(`User connected ${socket.id}`);

        socket.emit(EVENTS.SERVER.ROOMS, rooms);

        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
            console.log({ roomName });

            const roomId = nanoid();

            rooms[roomId] = {
                name: roomName,
            };

            socket.join(roomId);

            socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

            socket.emit(EVENTS.SERVER.ROOMS, rooms);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
        });

        socket.on(
            EVENTS.CLIENT.SEND_ROOM_MESSAGE,
            ({ roomId, message, userName }) => {
                const date = new Date();

                socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                    message,
                    userName,
                    time: `${date.getHours()} : ${date.getMinutes()}`,
                });
            }
        );

        socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
            socket.join(roomId);

            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
        });
    });
}

export default socket;
