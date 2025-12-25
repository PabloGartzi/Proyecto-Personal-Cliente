import { Link, useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import React from 'react';

export const CreateUser = () => {
    const [cookies] = useCookies(['token']);
    const navigate = useNavigate();

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const user_name = ev.target.elements.user_name.value;
        const user_email = ev.target.elements.user_email.value;
        const password = ev.target.elements.password.value;
        const role = ev.target.elements.role.value;

        try {
            const res = await fetch(`http://localhost:4001/admin/createUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.token}`,
                },
                body: JSON.stringify({ user_name, user_email, password, role }),
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error("Error al crear usuario");
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.log(error);
            alert(error);
        }
    };
    return (
        <div className="edit-user">
        <h2>Crear usuario nuevo</h2>
        <form onSubmit={handleSubmit} className="edit-user-form">
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
