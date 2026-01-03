import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCookies } from 'react-cookie';
import {jwtDecode} from "jwt-decode";


export const EditReport = () => {
    const { report_id } = useParams();
    const [cookies] = useCookies(['token']);
    const [form, setForm] = useState(null);
    const navigate = useNavigate();

    // Traer los datos del reporte
    const fetchReport = async () => {
        try {
            const res = await fetch(`http://localhost:4001/worker/getReportById/${report_id}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }
            
            setForm({
                report_notes: data.data.report_notes,
                imagen: data.data.report_photo_url,
            });

        } catch (error) {
        console.log(error);
        navigate('/worker/dashboard');
        }
    };

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!form) return;
        const decoded = jwtDecode(cookies.token);
        const uid = decoded.uid;
        try {
            const formData = new FormData(ev.target); //Formulario (El texto que meta el worker y la imágen)
            const res = await fetch(`http://localhost:4001/worker/updateReport/${report_id}/${uid}/`, {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${cookies.token}`
                },
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }
            navigate('/worker/dashboard');

        } catch (error) {
            console.log(error);
            alert(error);
        }
    };
    
    useEffect(() => {
        fetchReport();
    }, [report_id, cookies.token]);
    
    if (!form) return <p>Cargando reporte...</p>;

    return (
        <div className="edit-report">
        <h2>Editar reporte: {report_id}</h2>
        <form onSubmit={handleSubmit} className="edit-report-form">
            <label htmlFor="report_notes">Informe</label>
            <textarea id="report_notes" name="report_notes" value={form.report_notes} onChange={handleChange} placeholder="Notas del reporte"/>
            {form.imagen && (
                    <div className="current-image">
                    <p>Imagen actual:</p>
                    <img
                        src={`http://localhost:4001/upload/${form.imagen}`}
                        alt="Imagen del reporte"
                        style={{ width: '200px', display: 'block', marginBottom: '1rem' }}
                    />
                    </div>
                )}

            <label htmlFor="imagen">Imagen del reporte:</label>
            <input type="file" id="imagen" name="imagen" accept="image/*"></input>

            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => navigate('/worker/dashboard')}> Cancelar </button>
        </form>
        </div>
    );
};
