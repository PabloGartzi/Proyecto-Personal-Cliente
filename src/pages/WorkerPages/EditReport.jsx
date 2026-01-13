import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCookies } from 'react-cookie';
import {jwtDecode} from "jwt-decode";
import "../../css/EditReport.css";
import "../../css/ModalErrorReporte.css"

const BASE_URL = import.meta.env.VITE_URL_BASE;

/**
 * Componente EditReport
 *
 * Permite a un trabajador:
 * - Visualizar un reporte existente
 * - Editar las notas del reporte
 * - Cambiar o subir una nueva imagen asociada
 * - Manejar permisos (solo el propietario puede actualizar)
 *
 * @component
 * @returns {JSX.Element} Formulario para editar un reporte
 */
export const EditReport = () => {
    const { report_id } = useParams();
    const [cookies] = useCookies(['token']);
    const [form, setForm] = useState(null);
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");


    /**
     * Trae los datos del reporte desde el backend usando el report_id
     *
     * @async
     * @function fetchReport
     * @throws {Error} Si no se puede obtener el reporte
     * @updates form
     */
    const fetchReport = async () => {
        try {
            const res = await fetch(`${BASE_URL}/worker/getReportById/${report_id}`, {
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

    /**
     * Actualiza el estado del formulario cuando cambian los campos
     *
     * @function handleChange
     * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} ev - Evento de cambio del input o textarea
     * @updates form
     */
    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Envía los cambios del reporte al backend
     *
     * @async
     * @function handleSubmit
     * @param {React.FormEvent<HTMLFormElement>} ev - Evento submit del formulario
     * @throws {Error} Si ocurre un error al actualizar
     * @checks permisos - Muestra popup si el usuario no es el propietario
     */
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!form) return;
        const decoded = jwtDecode(cookies.token);
        const uid = decoded.uid;
        try {
            const formData = new FormData(ev.target); //Formulario (El texto que meta el worker y la imágen)
            const res = await fetch(`${BASE_URL}/worker/updateReport/${report_id}/${uid}`, {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${cookies.token}`
                },
                body: formData
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
            <p className='current-image-title'>Imagen actual:</p>
            {form.imagen && (
                    <div className="current-image">
                    <img
                        src={`${BASE_URL}/upload/${form.imagen}`}
                        alt="Imagen del reporte"
                    />
                    </div>
                )}

            <label htmlFor="imagen">Imagen del reporte:</label>
            <input type="file" id="imagen" name="imagen" accept="image/*"></input>

            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => navigate('/worker/dashboard')}> Cancelar </button>
        </form>
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
