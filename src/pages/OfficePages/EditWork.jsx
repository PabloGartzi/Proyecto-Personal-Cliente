import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCookies } from 'react-cookie';

export const EditWork = () => {
    const { id } = useParams();
    const [cookies] = useCookies(['token']);
    const [form, setForm] = useState(null);
    const navigate = useNavigate();

    // Traer los datos del trabajo
    const fetchWork = async () => {
        try {
        const res = await fetch(`http://localhost:4001/office/dashboard/${id}`, {
            headers: { Authorization: `Bearer ${cookies.token}` }
        });

        if (!res.ok) throw new Error('Error al obtener el trabajo');

        const data = await res.json();
        console.log(data)
        console.log(data.data.job_title,"datossss")
        setForm({
            job_title: data.data.job_title,
            job_description: data.data.job_description,
            job_status: data.data.job_status,
            job_address: data.data.job_address,
            job_latitude: data.data.job_latitude,
            job_longitude: data.data.job_longitude,
            user_email: data.data.worker_email
        });
        } catch (error) {
        console.log(error);
        navigate('/office/dashboard');
        }
    };

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!form) return;

        try {
        const res = await fetch(`http://localhost:4001/office/updateWork/${id}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.token}`
            },
            body: JSON.stringify(form)
        });

        if (!res.ok) throw new Error('Error al actualizar el trabajo');

        navigate('/office/dashboard');
        } catch (error) {
        console.log(error);
        alert(error);
        }
    };
    
    useEffect(() => {
        fetchWork();
    }, [id, cookies.token]);
    
    if (!form) return <p>Cargando trabajo...</p>;

    return (
        <div className="edit-work">
        <h2>Editar trabajo: {form.job_title}</h2>
        <form onSubmit={handleSubmit} className="edit-work-form">
            <input type="text" name="job_title" value={form.job_title} onChange={handleChange} placeholder="Título" required />
            <input type="text" name="job_description" value={form.job_description} onChange={handleChange} placeholder="Descripción" required />
            <select name="job_status" value={form.job_status} onChange={handleChange} required>
                <option value="pendiente">pendiente</option>
                <option value="en curso">en curso</option>
                <option value="completado">completado</option>
            </select>
            <input type="text" name="job_address" value={form.job_address} onChange={handleChange} placeholder="Dirección" required />
            <input type="number" name="job_latitude" value={form.job_latitude} onChange={handleChange} placeholder="Latitud" required />
            <input type="number" name="job_longitude" value={form.job_longitude} onChange={handleChange} placeholder="Longitud" required />
            <input type="email" name="user_email" value={form.user_email} onChange={handleChange} placeholder="Email del trabajador" required/>
            
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => navigate('/office/dashboard')}>
                Cancelar
            </button>
        </form>
        </div>
    );
};
