import React from "react";
import '../css/ViewAlerts.css'

export const ViewAlerts = ({ alerts, onClose, onDeleteAlert }) => {
  if (!alerts || alerts.length === 0) return null; // no pintar nada si no hay alertas

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Alertas</h2>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <ul className="alerts-list">
          {alerts.map((alert) => (
            <li key={alert.alert_id} className="alert">
              <strong>{alert.alert_title}</strong>
              <p>{alert.alert_message}</p>
              <small>{new Date(alert.alert_created_at).toLocaleString()}</small>
              <button
                className="delete-alert-btn"
                onClick={() => onDeleteAlert(alert.alert_id)}
              >
                Eliminar alerta
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
