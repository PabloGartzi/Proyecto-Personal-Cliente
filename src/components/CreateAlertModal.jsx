import React, { useState } from "react";
import '../css/CreateAlertModal.css';

export const CreateAlertModal = ({ isOpen, onClose, token }) => {
    const [receiverEmail, setReceiverEmail] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSendAlert = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_URL_BASE}/alerts/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    receiver_email: receiverEmail,
                    title,
                    message,
                    type: "info",
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg);
            
            setReceiverEmail("");
            setTitle("");
            setMessage("");
            onClose();
        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <form className="modal-form" onSubmit={handleSendAlert}>
            <h3>Crear alerta</h3>
            <label>
                <p>Email del trabajador</p>
                <input type="email" placeholder="Email del trabajador" value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)} required />
            </label>
            
            <label>
                Título
                <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            
            <label>
                <p>Mensaje</p>
                <textarea placeholder="Mensaje" value={message} onChange={(e) => setMessage(e.target.value)} required />
            </label>
            
            <div className="modal-actions">
                <button type="submit" disabled={loading}> {loading ? "Enviando..." : "Enviar alerta"} </button>
                <button type="button" onClick={onClose}> Cancelar </button>
            </div>
            </form>
        </div>
    );
};
