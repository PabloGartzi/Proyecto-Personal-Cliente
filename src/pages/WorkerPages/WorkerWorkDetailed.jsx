import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export const WorkerWorkDetailed = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [cookies] = useCookies(['token']);

    const [work, setWork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setLoading(false);
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

    useEffect(() => {
        // Si se intenta entrar directamente sin state le manda para fuera. Asi evitamos fetch con undefined: Si ponemos la url /worker/work directamente por ejemplo
        if (!state?.jobId) {
            navigate('/worker/dashboard');
            return;
        }
        fetchWork();
    }, [state, cookies.token, navigate]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="worker-work-detail">
            <h2>Detalle del trabajo</h2>
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
                        <th>Creado en</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{work.job_id}</td>
                        <td>{work.job_title}</td>
                        <td>{work.job_description}</td>
                        <td>{work.job_status}</td>
                        <td>{work.job_address}</td>
                        <td>{work.job_latitude}</td>
                        <td>{work.job_longitude}</td>
                        <td>{new Date(work.job_created_at).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            <hr />
            <div className="update-status">
                <h3>Actualizar estado</h3>
                <form onSubmit={handleSubmit} className="edit-work">
                    <select name="job_status" value={work.job_status} onChange={handleChange} required>
                        <option value="pendiente">pendiente</option>
                        <option value="en curso">en curso</option>
                        <option value="completado">completado</option>
                    </select>
                    <button type="submit">Guardar cambios</button>
                </form>
            </div>
        </div>
    );
};
