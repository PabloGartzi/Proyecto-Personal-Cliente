import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import '../../css/AdminModalBorrarUsuario.css';
import { useNavigate } from 'react-router';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cookies] = useCookies(['token']);
        
    const [ventanaModal, setVentanaModal] = useState(false);
    const [borrarUsuario, setBorrarUsuario] = useState(null);


// VENTANA MODAL PARA ELIMINAR USUARIOS
    const abrirVentanaModal = (user) => {
        setBorrarUsuario(user);
        setVentanaModal(true);
    };
    const cerrarVentanaModal = () => {
        setBorrarUsuario(null);
        setVentanaModal(false);
    };
    const confirmarBorrado = async () => {
        if (!borrarUsuario) return;
        await handleDelete(borrarUsuario.user_id);
        cerrarVentanaModal();
    };


    const fetchUsers = async () => {
        try {
        const res = await fetch('http://localhost:4001/admin/dashboard', {
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
        setUsers(data.data);

        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // const confirm = window.confirm("¿Estás seguro que quieres eliminar este usuario?");
        // if (!confirm) return;

        try {
        const res = await fetch(`http://localhost:4001/admin/deleteUser/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Error al eliminar usuario");
        }

        // Actualizar lista de usuarios después de eliminar
        setUsers(users.filter(user => user.user_id !== id));
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el usuario");
        }
    };

    const handleEdit = (user) => {
        navigate(`/admin/editUser/${user.user_id}`);
    };
    const handleCreateUser = () => {
        navigate(`/admin/createUser`)
    };

    useEffect(() => {
        fetchUsers();
    }, [cookies.token]);

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>{error}</p>;

    return (
    <div className="admin-dashboard">
    <h2>Panel de Administración</h2>

    <div className="admin-create-user">
      <button className="btn-create-user" onClick={handleCreateUser}>
        + Crear nuevo usuario
      </button>
    </div>
    <table className="users-table">
        <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Creado en</th>
            <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        {users.length === 0 ? (
            <tr>
            <td colSpan="7">No hay usuarios</td>
            </tr>
        ) : (
            users.map(user => (
            <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.user_name}</td>
                <td>{user.user_email}</td>
                <td>{user.role_name}</td>
                <td>{user.is_active ? 'Sí' : 'No'}</td>
                <td>{new Date(user.user_created_at).toLocaleString()}</td>
                <td>
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => abrirVentanaModal(user)}>Eliminar</button>
                </td>
            </tr>
            ))
        )}
        </tbody>
    </table>
    {ventanaModal && (
    <div className="modal-borrar-usuario">
        <div className="modal">
        <p>¿Estás seguro que quieres eliminar {borrarUsuario.user_name}?</p>
        <button onClick={confirmarBorrado}>Sí, eliminar</button>
        <button onClick={cerrarVentanaModal}>Cancelar</button>
        </div>
    </div>
    )}
    </div>
);
};