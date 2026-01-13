import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {jwtDecode} from "jwt-decode";
import "../../css/ModalBorrar.css"
import "../../css/WorkerWorkDetailed.css"
import "../../css/ModalErrorReporte.css"

const BASE_URL = import.meta.env.VITE_URL_BASE;

/**
 * Componente WorkerWorkDetailed
 *
 * Permite al trabajador:
 * - Visualizar los detalles de un trabajo específico
 * - Actualizar el estado del trabajo ("pendiente", "en curso", "completado")
 * - Ver todos los reportes asociados al trabajo
 * - Crear un nuevo reporte
 * - Descargar todos los reportes en PDF
 * - Editar o eliminar reportes (si es propietario)
 * - Mostrar mensajes de error si intenta eliminar reportes de otros
 *
 * @component
 * @returns {JSX.Element} Componente de vista detallada de un trabajo
 */
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

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    /**
     * Abre la ventana modal para confirmar eliminación de un reporte
     *
     * @function
     * @inner
     * @param {Object} report - Reporte a eliminar
     */
    const abrirVentanaModal = (report) => {
        setBorrarReporte(report);
        setVentanaModal(true);
    };

    /**
     * Cierra la ventana modal de eliminación de reporte
     *
     * @function
     * @inner
     */
    const cerrarVentanaModal = () => {
        setBorrarReporte(null);
        setVentanaModal(false);
    };

    /**
     * Confirma la eliminación del reporte seleccionado
     *
     * @function
     * @inner
     * @async
     */
    const confirmarBorrado = async () => {
        if (!borrarReporte) return;
        await handleDelete(borrarReporte.report_id);
        cerrarVentanaModal();
    };    

    /**
     * Obtiene la información del trabajo desde el backend
     *
     * @function
     * @inner
     * @async
     */
    const fetchWork = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/worker/work/${state.jobId}`,
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
    
    /**
     * Obtiene los reportes asociados al trabajo desde el backend
     *
     * @function
     * @inner
     * @async
     */
    const fetchReports = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/worker/viewWorkReport/${state.jobId}`,
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

    /**
     * Maneja los cambios de los inputs para actualizar el estado local del trabajo
     *
     * @function
     * @inner
     * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} ev - Evento de cambio
     */
    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setWork((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Envía los cambios del trabajo al backend para actualizarlo
     *
     * @function
     * @inner
     * @async
     * @param {React.FormEvent} ev - Evento submit del formulario
     */
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const res = await fetch(
                `${BASE_URL}/worker/updateWork/${state.jobId}`,
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
    
    /**
     * Descarga todos los reportes del trabajo como PDF
     *
     * @function
     * @inner
     * @async
     * @param {number|string} id - ID del trabajo
     */
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


    /**
     * Navega a la creación de un nuevo reporte para este trabajo
     *
     * @function
     * @inner
     * @param {Object} work - Trabajo para el cual se creará el reporte
     */
    const handleCreateReport = (work) => {
        //Si pasaramos en parametros el job_id tendríamos un problema de seguridad:
        // Cualquier trabajador podría acceder a los trabajos de otro...
        navigate('/worker/createReport', {
            state: {
                jobId: work.job_id
            }
        });
    };

    /**
     * Elimina un reporte específico si el trabajador es propietario
     *
     * @function
     * @inner
     * @async
     * @param {number|string} id - ID del reporte a eliminar
     */
    const handleDelete = async (id) => {
        // const confirm = window.confirm("¿Estás seguro que quieres eliminar este usuario?");
        // if (!confirm) return;
        const decoded = jwtDecode(cookies.token);
        const uid = decoded.uid;
        try {
            const res = await fetch(`${BASE_URL}/worker/deleteReport/${id}/${uid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.token}`,
                },
            });

            const data = await res.json();
            if (res.status === 403) {
                setPopupMessage("No eres el propietario de este informe");
                setShowPopup(true);
                return;
            }
            if (!res.ok) {
                throw new Error(data.msg);
            }
            setReports(reports.filter(report => report.report_id !== id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    /**
     * Navega a la edición de un reporte
     *
     * @function
     * @inner
     * @param {Object} report - Reporte a editar
     */
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
                        <td data-label="ID">{work.job_uuid}</td>
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
                            <td colSpan="10">No hay reportes</td>
                        </tr>
                    ) : (reports.map(report => (
                            <tr key={report.report_id}>
                                <td data-label="ID reporte">{report.report_id}</td>
                                <td data-label="ID trabajador">{report.worker_user_id}</td>
                                <td data-label="Notas">{report.report_notes}</td>
                                <td data-label="Fecha">{new Date(report.report_created_at).toLocaleString()}</td>
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

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Acción no permitida</h3>
                        <p>{popupMessage}</p>
                        <button onClick={() => setShowPopup(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};
