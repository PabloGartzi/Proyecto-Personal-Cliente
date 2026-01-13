import { Link, useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import React from 'react';
import "../../css/CreateUser.css";

const BASE_URL = import.meta.env.VITE_URL_BASE;

/**
 * Componente CreateUser
 *
 * Formulario para crear un nuevo usuario en el sistema.
 * Permite ingresar nombre, email, contraseña y rol, y realiza
 * la petición al backend para crear el usuario. Redirige al
 * dashboard de administración tras un registro exitoso.
 *
 * Roles disponibles:
 * - "admin"
 * - "office"
 * - "worker"
 *
 * @component
 * @returns {JSX.Element} Componente de creación de usuario
 */
export const CreateUser = () => {
    const [cookies] = useCookies(['token']);
    const navigate = useNavigate();

    /**
     * Maneja el envío del formulario para crear un usuario
     *
     * @function
     * @inner
     * @param {React.FormEvent<HTMLFormElement>} ev - Evento de envío del formulario
     * @async
     * @throws {Error} Si la petición al backend falla
     */
    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const user_name = ev.target.elements.user_name.value;
        const user_email = ev.target.elements.user_email.value;
        const password = ev.target.elements.password.value;
        const role = ev.target.elements.role.value;

        try {
            const res = await fetch(`${BASE_URL}/admin/createUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.token}`,
                },
                body: JSON.stringify({ user_name, user_email, password, role }),
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.log(error);
            alert(error);
        }
    };
    return (
        <div className="create-user">
        <h2>Crear usuario nuevo</h2>
        <form noValidate onSubmit={handleSubmit} className="create-user-form">
            <input type="text" name="user_name" placeholder="Nombre" required />
            <input type="email" name="user_email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Nueva contraseña" />
            <select name="role" required>
            <option value="admin">Admin</option>
            <option value="office">Office</option>
            <option value="worker">Worker</option>
            </select>
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => navigate('/admin/dashboard')}>Cancelar</button>
        </form>
        </div>
    );
}
