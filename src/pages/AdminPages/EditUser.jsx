import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCookies } from 'react-cookie';
import {jwtDecode} from "jwt-decode";

export const EditUser = () => {
    const { id } = useParams();
    const [cookies, setCookie] = useCookies(['token']);
    const [form, setForm] = useState(null);
    const navigate = useNavigate();
    
    const fetchUser = async () => {
        try {
            const res = await fetch(`http://localhost:4001/admin/dashboard/${id}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.msg);
            }

            setForm({
                user_name: data.data.user_name,
                user_email: data.data.user_email,
                password: '',
                role: data.data.role_name
            });
        } catch (error) {
            console.log(error)
            navigate('/admin/dashboard');
        }
        };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form) return;
        try {
            const res = await fetch(`http://localhost:4001/admin/updateUser/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.token}`
                },
                body: JSON.stringify({
                    user_name: form.user_name || null,
                    user_email: form.user_email || null,
                    password: form.password || null,
                    role: form.role || null
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }

            const decoded = jwtDecode(cookies.token);
            const currentUserId = decoded.uid;
            if (parseInt(id) === currentUserId) {
                setCookie('token', '', { path: '/' });
                setCookie('rol', '', { path: '/' });
                alert('Has modificado tu propio usuario. Debes iniciar sesión de nuevo.');
                navigate('/login');
            } else {
                navigate('/admin/dashboard');
            }
        
        } catch (error) {
            console.log(error);
            alert(error);
        }
    };

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setForm((formulario) => ({ ...formulario, [name]: value }));
    };

    useEffect(() => {
        fetchUser();
    }, [id, cookies.token, navigate]);


    if (!form) return <p>Cargando usuario...</p>;

    return (
        <div className="edit-user">
        <h2>Editar usuario: {form.user_name}</h2>
        <form onSubmit={handleSubmit} className="edit-user-form">
            <input type="text" name="user_name" value={form.user_name} onChange={handleChange} placeholder="Nombre" required />
            <input type="email" name="user_email" value={form.user_email} onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Nueva contraseña" />
            <select name="role" value={form.role} onChange={handleChange} required>
            <option value="admin">Admin</option>
            <option value="office">Office</option>
            <option value="worker">Worker</option>
            </select>
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => navigate('/admin/dashboard')}>Cancelar</button>
        </form>
        </div>
    );
};
