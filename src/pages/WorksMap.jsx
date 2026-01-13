import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { RecenterMap } from '../helpers/RecenterMap';
import "../css/WorksMap.css";

/**
 * Componente WorksMap
 *
 * Muestra un mapa con los trabajos proporcionados mediante markers.
 * Cada marker representa un trabajo y se colorea según su estado:
 * - "pendiente" → rojo
 * - "en curso" → azul
 * - "completado" → verde
 * - otros → gris
 *
 * Calcula automáticamente el centro del mapa usando la media de
 * las coordenadas de todos los trabajos y recenteriza el mapa
 * cuando cambia la lista de trabajos.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.works - Lista de trabajos a mostrar
 * @returns {JSX.Element} Componente que renderiza el mapa con markers
 */
export const WorksMap = ({ works }) => {
    if (!works.length) return <p className="works-map-empty">No hay trabajos para mostrar en el mapa</p>;

    /**
     * Devuelve el color correspondiente a un estado de trabajo
     *
     * @function
     * @inner
     * @param {string} status - Estado del trabajo
     * @returns {string} Color asociado al estado
     */
    const getColorByStatus = (status) => {
        switch (status) {
        case 'pendiente': return 'red';
        case 'en curso': return 'blue';
        case 'completado': return 'green';
        default: return 'gray';
        }
    };

    // Calculamos el centro del mapa haciendo la media de las cordenadas
    const avgLat = works.reduce((sum, w) => sum + parseFloat(w.job_latitude), 0) / works.length;
    const avgLng = works.reduce((sum, w) => sum + parseFloat(w.job_longitude), 0) / works.length;

    return (
        <div className="works-map-wrapper">
            <MapContainer center={[avgLat, avgLng]} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

            <RecenterMap center={[avgLat, avgLng]} animate={true}/>

            {works.map((work) => (
                <CircleMarker
                key={work.job_id}
                center={[parseFloat(work.job_latitude), parseFloat(work.job_longitude)]}
                radius={8}
                fillOpacity={0.8}
                color={getColorByStatus(work.job_status)}
                >
                <Popup>
                    {work.job_title}<br />
                    Estado: {work.job_status}<br />
                    Dirección: {work.job_address}<br />
                    Trabajador: {work.worker_name || work.assigned_worker_user_email || '-'}
                </Popup>
                </CircleMarker>
            ))}
            </MapContainer>
        </div>
    );
};
