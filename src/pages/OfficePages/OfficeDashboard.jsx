import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { LogoutButton } from '../../components/LogoutButton';
import { jwtDecode } from 'jwt-decode';
import { WorksMap } from '../WorksMap';
import '../../css/ModalBorrar.css';

const BASE_URL = import.meta.env.VITE_URL_BASE;

export const OfficeDashboard = () => {
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loadingWorks, setLoadingWorks] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    const [error, setError] = useState(null);
    const [cookies] = useCookies(['token']);

    const [totalWorks, setTotalWorks] = useState(0);
    const [worksPending, setWorksPending] = useState(0);
    const [worksInProgress, setWorksInProgress] = useState(0);
    const [worksCompleted, setWorksCompleted] = useState(0);

    const [ventanaModal, setVentanaModal] = useState(false);
    const [borrarWork, setBorrarWork] = useState(null);

    const [busquedaTitulo, setBusquedaTitulo] = useState("");
    const [busquedaEmail, setBusquedaEmail] = useState("");
    const [busquedaFecha, setBusquedaFecha] = useState("");
    const [busquedaEstado, setBusquedaEstado] = useState("");


    // Modal de confirmación
    const abrirVentanaModal = (work) => {
        setBorrarWork(work);
        setVentanaModal(true);
    };

    const cerrarVentanaModal = () => {
        setBorrarWork(null);
        setVentanaModal(false);
    };

    const confirmarBorrado = async () => {
        if (!borrarWork) return;
        await handleDelete(borrarWork.job_id);
        cerrarVentanaModal();
    };

    const fetchStatistics = async () => {
        try {
        const res = await fetch(`${BASE_URL}/office/statistics`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.token}`,
            },
        });

        if (!res.ok) {
            throw new Error('Error al obtener usuarios');
        }

        const data = await res.json();
        
        setTotalWorks(data.data.total_works)
        setWorksPending(data.data.works_pending)
        setWorksInProgress(data.data.works_in_progress)
        setWorksCompleted(data.data.works_completed)

        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setLoadingStats(false);
        }
    };

    // Fetch de todos los trabajos
    const fetchWorks = async () => {
        try {
            const res = await fetch(`${BASE_URL}/office/dashboard`, {
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
            console.log(data.data)

        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setLoadingWorks(false);
        }
    };

    // Borrar trabajo
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/office/deleteWork/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }

            setWorks(prev => prev.filter(work => work.job_id !== id));
            fetchStatistics();

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleEdit = (work) => {
        navigate(`/office/editWork/${work.job_id}`);
    };

    const handleCreateWork = () => {
        navigate('/office/createWork');
    };

    const handleReports = async (id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/worker/workReport/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error(data.msg);
            }
            
            const blob = await res.blob();// Convertimos la respuesta en un Blob
            const url = window.URL.createObjectURL(blob); // Creamos una URL temporal
            const a = document.createElement("a");// Creamos un enlace para descargar el pdf de la url que hemos creado
            a.href = url;
            a.download = `reportes_trabajo_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();// Borramos en elnace una vez lo hemos usado para descargar el pdf
            window.URL.revokeObjectURL(url);
            // navigate('/worker/dashboard');

        } catch (error) {
            console.log("ERROR:", error)
            alert(error);
        }
    };

    useEffect(() => {
        fetchWorks();
        fetchStatistics();
    }, [cookies.token]);

    const trabajosFiltrados = works.filter(work => 
        `${work.assigned_worker_user_email}`
            .toLowerCase()
            .includes(busquedaEmail.toLowerCase().trim())
        &&
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

    if (loadingWorks || loadingStats) return <p>Cargando trabajos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="office-dashboard">
            <h2>Panel de Oficina</h2>
            <LogoutButton />

            <div className="estadisticas">
                <div className="stat-card">
                    <h3>Total de trabajos:</h3>
                    <p>{totalWorks}</p>
                </div>
                <div className="stat-card">
                    <h3>Trabajos pendientes:</h3>
                    <p>{worksPending}</p>
                </div>
                <div className="stat-card">
                    <h3>Trabajos en curso:</h3>
                    <p>{worksInProgress}</p>
                </div>
                <div className="stat-card">
                    <h3>Trabajos completados:</h3>
                    <p>{worksCompleted}</p>
                </div>
            </div>
            <div className="office-create-work">
                <button className="btn-create-work" onClick={handleCreateWork}>
                    + Crear nuevo trabajo
                </button>
            </div>
            <div className="office-search">
                <input type="text" placeholder="Filtrar por titulo" value={busquedaTitulo} onChange={(e) => setBusquedaTitulo(e.target.value)} />
                <input type="text" placeholder="Filtrar por email" value={busquedaEmail} onChange={(e) => setBusquedaEmail(e.target.value)} />
                <input type="text" placeholder="Filtrar por fecha" value={busquedaFecha} onChange={(e) => setBusquedaFecha(e.target.value)} />
                <select name="job_status" onChange={(e) => setBusquedaEstado(e.target.value)}>
                    <option value="">No filtrar</option>
                    <option value="pendiente">pendiente</option>
                    <option value="en curso">en curso</option>
                    <option value="completado">completado</option>
                </select>
            </div>
            <table className="works-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Dirección</th>
                        <th>Latitud</th>
                        <th>Longitud</th>
                        <th>Asignado a (email)</th>
                        <th>Creado en</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {trabajosFiltrados.length == 0 ? (
                        <tr>
                            <td colSpan="10">No hay trabajos</td>
                        </tr>
                    ) : (
                        trabajosFiltrados.map(work => (
                            <tr key={work.job_id}>
                                <td data-label="ID">{work.job_id}</td>
                                <td data-label="Título">{work.job_title}</td>
                                <td data-label="Descripción">{work.job_description}</td>
                                <td data-label="Estado">{work.job_status}</td>
                                <td data-label="Dirección">{work.job_address}</td>
                                <td data-label="Latitud">{work.job_latitude}</td>
                                <td data-label="Longitud">{work.job_longitude}</td>
                                <td data-label="Asignado a">{work.assigned_worker_user_email || '-'}</td>
                                <td data-label="Creado en">{new Date(work.job_created_at).toLocaleString()}</td>
                                <td data-label="Acciones">
                                    <button onClick={() => handleEdit(work)}>Editar</button>
                                    <button onClick={() => abrirVentanaModal(work)}>Eliminar</button>
                                    <button onClick={() => handleReports(work.job_id)}>Descargar Reportes</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <h3 className='titulo-mapa'>Mapa de trabajos</h3>
            <WorksMap works={trabajosFiltrados} />

            {ventanaModal && (
                <div className="modal-borrar">
                    <div className="modal">
                        <p>¿Estás seguro que quieres eliminar "{borrarWork.job_title}"?</p>
                        <button onClick={confirmarBorrado}>Sí, eliminar</button>
                        <button onClick={cerrarVentanaModal}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};