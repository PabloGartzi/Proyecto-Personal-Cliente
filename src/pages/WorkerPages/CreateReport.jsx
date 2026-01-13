import React from 'react'
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {jwtDecode} from "jwt-decode";
import "../../css/CreateReport.css";

const BASE_URL = import.meta.env.VITE_URL_BASE;

/**
 * Componente CreateReport
 *
 * Permite a un trabajador:
 * - Crear un nuevo reporte asociado a un trabajo
 * - Ingresar notas de texto
 * - Subir una imagen asociada al reporte
 *
 * @component
 * @returns {JSX.Element} Formulario para crear un nuevo reporte
 */
export const CreateReport = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [cookies] = useCookies(['token']);

    const [error, setError] = useState(null);
    
    /**
     * Envía los datos del reporte al backend
     *
     * @async
     * @function
     * @param {React.FormEvent<HTMLFormElement>} ev - Evento de submit del formulario
     */
    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const formData = new FormData(ev.target); //Formulario (El texto que meta el worker y la imágen)
        
        const job_id = state.jobId;

        const decoded = jwtDecode(cookies.token);
        const worker_user_id = decoded.uid;

        try {
            const res = await fetch(`${BASE_URL}/worker/createReport/${job_id}/${worker_user_id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
                body: formData,
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }
            navigate('/worker/dashboard');
        } catch (error) {
            setError(error);
            console.log(error);
            alert(error);
        }
    };

    return (
        <div className="create-report">
        <h2>Crear reporte nuevo</h2>
        <form onSubmit={handleSubmit} className="create-report-form">
            <label htmlFor="report_notes">Informe</label>
            <textarea id="report_notes" name="report_notes" placeholder="Informe" />
            
            <label htmlFor="imagen">Imagen del reporte:</label>
            <input type="file" id="imagen" name="imagen" accept="image/*"></input>
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => navigate('/worker/dashboard')}>Cancelar</button>
        </form>
        </div>
    )
}
