import { useEffect } from "react";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_URL_BASE;

export const useAlertsSocket = (email, onNewAlert) => {
  useEffect(() => {
    console.log(email,"======EMAIL=======")
    if (!email) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket conectado:", socket.id);
      socket.emit("register", email);
    });

    socket.on("new-alert", (alert) => {
        onNewAlert(alert);
    });

    return () => {
      socket.off("new-alert");
      socket.disconnect();
    };
  }, [email]);
};
