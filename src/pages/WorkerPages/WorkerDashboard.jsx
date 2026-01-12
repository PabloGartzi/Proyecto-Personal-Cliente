import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { LogoutButton } from '../../components/LogoutButton';
import {jwtDecode} from "jwt-decode";
import { WorksMap } from '../WorksMap';
import '../../css/WorkerDashboard.css'

const BASE_URL = import.meta.env.VITE_URL_BASE;

export const WorkerDashboard = () => {
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cookies, setCookie] = useCookies(['token']);

    const [busquedaTitulo, setBusquedaTitulo] = useState("");
    const [busquedaFecha, setBusquedaFecha] = useState("");
    const [busquedaEstado, setBusquedaEstado] = useState("");

    const fetchJobs = async () => {
        const decoded = jwtDecode(cookies.token);
        const id = decoded.uid;
        try {
        const res = await fetch(`${BASE_URL}/worker/dashboard/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.token}`,
            },
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.msg);
        }
        
        setWorks(data.data);

        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDetailed = (work) => {
        //Si pasaramos en parametros el job_id tendríamos un problema de seguridad:
        // Cualquier trabajador podría acceder a los trabajos de otro...
        navigate('/worker/work', {
            state: {
                jobId: work.job_id
            }
        });
    };


    useEffect(() => {
        fetchJobs();
    }, [cookies.token]);

    const trabajosFiltrados = works.filter(work => 
        `${work.job_title}`
            .toLowerCase()
            .includes(busquedaTitulo.toLowerCase().trim())
        &&
        `${new Date(work.job_created_at).toLocaleString()}`
            .toLowerCase()
            .includes(busquedaFecha.toLowerCase().trim())
        &&
        `${work.job_status}`
            .toLowerCase()
            .includes(busquedaEstado.toLowerCase().trim())
    );
    if (loading) return <p>Cargando trabajos...</p>;
    if (error) return <p>{error}</p>;

    return (
    <div className="worker-dashboard">
    <h2>Mis trabajos</h2>
    
    <LogoutButton/>

    <div className="office-search">
        <input type="text" placeholder="Filtrar por titulo" value={busquedaTitulo} onChange={(e) => setBusquedaTitulo(e.target.value)} />
        <input type="text" placeholder="Filtrar por fecha" value={busquedaFecha} onChange={(e) => setBusquedaFecha(e.target.value)} />
        <select name="job_status" onChange={(e) => setBusquedaEstado(e.target.value)}>
            <option value="">No filtrar</option>
            <option value="pendiente">pendiente</option>
            <option value="en curso">en curso</option>
            <option value="completado">completado</option>
        </select>
    </div>
    <table className="jobs-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Creado en</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {trabajosFiltrados.length === 0 ? (
                <tr>
                    <td colSpan="10">No hay trabajos</td>
                </tr>
            ) : (trabajosFiltrados.map(work => (
                    <tr key={work.job_id}>
                        <td data-label="ID">{work.job_id}</td>
                        <td data-label="Título">{work.job_title}</td>
                        <td data-label="Descripción">{work.job_description}</td>
                        <td data-label="Estado">{work.job_status}</td>
                        <td data-label="Creado en">{new Date(work.job_created_at).toLocaleString()}</td>
                        <td data-label="Acciones">
                            <button onClick={() => handleDetailed(work)}>Abrir vista detallada</button>
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    </table>
    <h3>Mapa de trabajos</h3>
    <WorksMap works={trabajosFiltrados} />
    </div>
);
};