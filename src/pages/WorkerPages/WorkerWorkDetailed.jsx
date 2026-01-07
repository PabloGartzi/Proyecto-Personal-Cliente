import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import "../../css/ModalBorrar.css"
import "../../css/WorkerWorkDetailed.css"

export const WorkerWorkDetailed = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [cookies] = useCookies(['token']);

    const [work, setWork] = useState(null);
    const [reports, setReports] = useState([]);
    const [loadingWork, setLoadingWork] = useState(true);
    const [loadingReports, setLoadingReports] = useState(true);

    const [error, setError] = useState(null);

    const [ventanaModal, setVentanaModal] = useState(false);
    const [borrarReporte, setBorrarReporte] = useState(null);

// VENTANA MODAL PARA ELIMINAR REPORTES
    const abrirVentanaModal = (report) => {
        setBorrarReporte(report);
        setVentanaModal(true);
    };
    const cerrarVentanaModal = () => {
        setBorrarReporte(null);
        setVentanaModal(false);
    };
    const confirmarBorrado = async () => {
        if (!borrarReporte) return;
        await handleDelete(borrarReporte.report_id);
        cerrarVentanaModal();
    };    

    const fetchWork = async () => {
        try {
            const res = await fetch(
                `http://localhost:4001/worker/work/${state.jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }
            
            setWork(data.data);
        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setLoadingWork(false);
        }
    };
    
    const fetchReports = async () => {
        try {
            const res = await fetch(
                `http://localhost:4001/worker/viewWorkReport/${state.jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }
            
            setReports(data.data);
        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setLoadingReports(false);
        }
    };

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setWork((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const res = await fetch(
                `http://localhost:4001/worker/updateWork/${state.jobId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cookies.token}`,
                    },
                    body: JSON.stringify(work)
                }
            );

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }
            navigate('/worker/dashboard');

        } catch (error) {
            console.log("ERROR:", error)
            alert(error);
        }
    };
    
    const handleReports = async (id) => {
        try {
            const res = await fetch(
                `http://localhost:4001/worker/workReport/${id}`,
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

    const handleCreateReport = (work) => {
        //Si pasaramos en parametros el job_id tendríamos un problema de seguridad:
        // Cualquier trabajador podría acceder a los trabajos de otro...
        navigate('/worker/createReport', {
            state: {
                jobId: work.job_id
            }
        });
    };
    const handleDelete = async (id) => {
        // const confirm = window.confirm("¿Estás seguro que quieres eliminar este usuario?");
        // if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:4001/worker/deleteReport/${id}`, {
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
            setReports(reports.filter(report => report.report_id !== id));
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el usuario");
        }
    };

    const handleEdit = (report) => {
        navigate(`/worker/editReport/${report.report_id}`);
    };

    useEffect(() => {
        // Si se intenta entrar directamente sin state le manda para fuera. Asi evitamos fetch con undefined: Si ponemos la url /worker/work directamente por ejemplo
        if (!state?.jobId) {
            navigate('/worker/dashboard');
            return;
        }
        fetchWork();
        fetchReports();
    }, [state, cookies.token, navigate]);

    if (loadingWork || loadingReports) return <p>Cargando...</p>;
    if (!work) return <p>No se pudo cargar el trabajo</p>;
    if (error) return <p>{error}</p>;


    return (
        <div className="worker-work-detail">
            <h2>Detalle del trabajo</h2>
            <table className="work-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Dirección</th>
                        <th>Latitud</th>
                        <th>Longitud</th>
                        <th>Creado en</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td data-label="ID">{work.job_id}</td>
                        <td data-label="Título">{work.job_title}</td>
                        <td data-label="Descripción">{work.job_description}</td>
                        <td data-label="Estado">{work.job_status}</td>
                        <td data-label="Dirección">{work.job_address}</td>
                        <td data-label="Latitud">{work.job_latitude}</td>
                        <td data-label="Longitud">{work.job_longitude}</td>
                        <td data-label="Creado en">{new Date(work.job_created_at).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            <hr />
            <div className="update-status">
                <h3>Actualizar estado</h3>
                <form onSubmit={handleSubmit} className="update-work">
                    <select name="job_status" value={work.job_status} onChange={handleChange} required>
                        <option value="pendiente">pendiente</option>
                        <option value="en curso">en curso</option>
                        <option value="completado">completado</option>
                    </select>
                    <button type="submit">Guardar cambios</button>
                </form>
            </div>
            <h3>Reportes del trabajo</h3>
            <table className="reports-table">
                <thead>
                    <tr>
                        <th>ID del reporte</th>
                        <th>ID del trabajador</th>
                        <th>Notas</th>
                        <th>Fecha de creación del reporte</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length === 0 ? (
                        <tr>
                            <td colSpan="10">No hay trabajos</td>
                        </tr>
                    ) : (reports.map(report => (
                            <tr key={report.report_id}>
                                <td data-label="ID reporte">{report.report_id}</td>
                                <td data-label="ID trabajador">{report.worker_user_id}</td>
                                <td data-label="Notas">{report.report_notes}</td>
                                <td data-label="Fecha">{report.report_created_at}</td>
                                <td data-label="Acciones">
                                    <button onClick={() => handleEdit(report)}>Editar reporte</button>
                                    <button onClick={() => abrirVentanaModal(report)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="download-reports">
                <h3>Descargar reportes</h3>
                <button onClick={() => handleReports(work.job_id)}>Descargar reportes</button>
            </div>
            <div className="create-new-report">
                <h3>Crear nuevo reporte</h3>
                <button className="btn-create-report" onClick={() => handleCreateReport(work)}>+ Crear nuevo informe </button>
            </div>
            {ventanaModal && (
                <div className="modal-borrar">
                    <div className="modal">
                        <p>¿Estás seguro que quieres eliminar el reporte {borrarReporte.report_id}?</p>
                        <button onClick={confirmarBorrado}>Sí, eliminar</button>
                        <button onClick={cerrarVentanaModal}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};
