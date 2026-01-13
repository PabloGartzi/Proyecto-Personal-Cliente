import { Link, useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import React from 'react';
import "../../css/CreateWork.css";

const BASE_URL = import.meta.env.VITE_URL_BASE;

/**
 * Componente CreateWork
 *
 * Formulario para crear un nuevo trabajo en el sistema.
 * Permite ingresar título, descripción, estado, dirección,
 * coordenadas (latitud y longitud) y el email del trabajador
 * asignado. Realiza la petición al backend y redirige al
 * dashboard de oficina tras un registro exitoso.
 *
 * Estados disponibles:
 * - "pendiente"
 * - "en curso"
 * - "completado"
 *
 * @component
 * @returns {JSX.Element} Componente de creación de trabajo
 */
export const CreateWork = () => {
    const [cookies] = useCookies(['token']);
    const navigate = useNavigate();

    /**
     * Maneja el envío del formulario para crear un trabajo
     *
     * @function
     * @inner
     * @param {React.FormEvent<HTMLFormElement>} ev - Evento de envío del formulario
     * @async
     * @throws {Error} Si la petición al backend falla
     */
    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const job_title = ev.target.elements.job_title.value;
        const job_description = ev.target.elements.job_description.value;
        const job_status = ev.target.elements.job_status.value;
        const job_address = ev.target.elements.job_address.value;
        const job_latitude = ev.target.elements.job_latitude.value;
        const job_longitude = ev.target.elements.job_longitude.value;
        const user_email = ev.target.elements.user_email.value;
        try {
            const res = await fetch(`${BASE_URL}/office/createWork`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.token}`,
                },
                body: JSON.stringify({ job_title, job_description, job_status, job_address, job_latitude, job_longitude, user_email}),
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }
            navigate('/office/dashboard');
        } catch (error) {
            console.log(error);
            alert(error);
        }
    };
    return (
        <div className="create-work">
        <h2>Crear trabajo nuevo</h2>
        <form onSubmit={handleSubmit} className="create-work-form">
            <input type="text" name="job_title" placeholder="Título" required />
            <input type="text" name="job_description" placeholder="Descripción" required />
            <select name="job_status" required>
                <option value="pendiente">pendiente</option>
                <option value="en curso">en curso</option>
                <option value="completado">completado</option>
            </select>
            <input type="text" name="job_address" placeholder="Dirección" required />
            <input type="number" name="job_latitude" placeholder="Latitud" required step="any" min="-90" max="90"/>
            <input type="number" name="job_longitude" placeholder="Longitud" required step="any" min="-180" max="180"/>
            <input type="email" name="user_email" placeholder="Email del trabajador" required />
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => navigate('/office/dashboard')}>Cancelar</button>
        </form>
        </div>
    );
}
