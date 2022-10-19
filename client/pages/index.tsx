import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useSockets } from "../context/socket.context";

import RoomsContainer from "../containers/Rooms";
import MessagesContainer from "../containers/Messages";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const { socket, userName, setUserName } = useSockets();
    const [userNameRef, setUserNameRef] = useState<string>();

    function handleSetUserName() {
        const value = userNameRef;
        if (!value) {
            return;
        }
        setUserName(value);

        localStorage.setItem("userName", value);
    }

    useEffect(() => {
        if (userNameRef) {
            setUserNameRef(localStorage.getItem("userName") || "");
        }
    }, []);

    return (
        <div>
            {!userName && (
                <div className={styles.usernameWrapper}>
                    <div className={styles.usernameInner}>
                        <div>
                            <input
                                placeholder="userName"
                                value={userNameRef}
                                onChange={(e) => setUserNameRef(e.target.value)}
                            />
                            <button className="cta" onClick={handleSetUserName}>
                                START
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {userName && (
                <div className={styles.container}>
                    <RoomsContainer />

                    <MessagesContainer />
                </div>
            )}
        </div>
    );
}
