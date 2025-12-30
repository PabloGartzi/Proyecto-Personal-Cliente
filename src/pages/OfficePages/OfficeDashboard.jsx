import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { LogoutButton } from '../../components/LogoutButton';
import { jwtDecode } from 'jwt-decode';
import { WorksMap } from '../WorksMap';
import '../../css/ModalBorrar.css';

export const OfficeDashboard = () => {
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cookies] = useCookies(['token']);

    const [ventanaModal, setVentanaModal] = useState(false);
    const [borrarWork, setBorrarWork] = useState(null);

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

    // Fetch de todos los trabajos
    const fetchWorks = async () => {
        try {
            const res = await fetch('http://localhost:4001/office/dashboard', {
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

    // Borrar trabajo
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:4001/office/deleteWork/${id}`, {
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

    useEffect(() => {
        fetchWorks();
    }, [cookies.token]);

    if (loading) return <p>Cargando trabajos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="office-dashboard">
            <h2>Panel de Oficina</h2>
            <LogoutButton />

            <div className="office-create-work">
                <button className="btn-create-work" onClick={handleCreateWork}>
                    + Crear nuevo trabajo
                </button>
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
                        <th>Asignado a (ID)</th>
                        <th>Creado en</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {works.length === 0 ? (
                        <tr>
                            <td colSpan="10">No hay trabajos</td>
                        </tr>
                    ) : (works.map(work => (
                            <tr key={work.job_id}>
                                <td>{work.job_id}</td>
                                <td>{work.job_title}</td>
                                <td>{work.job_description}</td>
                                <td>{work.job_status}</td>
                                <td>{work.job_address}</td>
                                <td>{work.job_latitude}</td>
                                <td>{work.job_longitude}</td>
                                <td>{work.assigned_worker_user_id || '-'}</td>
                                <td>{new Date(work.job_created_at).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => handleEdit(work)}>Editar</button>
                                    <button onClick={() => abrirVentanaModal(work)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <h3>Mapa de trabajos</h3>
            <WorksMap works={works} />

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