import { Link, useNavigate } from 'react-router';
import React from 'react';
import { jwtDecode } from "jwt-decode";
import { useCookies } from 'react-cookie';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [, setCookie] = useCookies(['token', 'rol']);

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const email = ev.target.elements.email.value;
        const password = ev.target.elements.password.value;

        const url = 'http://localhost:4001/login';
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        };

        try {
            const res = await fetch(url, options);
            if (!res.ok) throw new Error("Error en la petición");

            const data = await res.json();
            const token = data.token;

            const decoded = jwtDecode(token);
            const rol = decoded.rol; // admin u office o worker

            // Guardar token en las cookies
            setCookie('token', token, {
                path: '/',
                maxAge: 60 * 60 * 24, // 1 día
                sameSite: 'strict'
            });

            // Redirección según el rol del usuario que inicia sesión
            if (rol == 'admin') {
                navigate('/admin/dashboard');
            } else if (rol == 'office') {
                navigate('/office/dashboard');
            } else {
                navigate('/worker/dashboard');
            }

        } catch (err) {
            console.error("Error login:", err);
            alert("Error al iniciar sesión");
        }
    };

    return (
        <>
            <h2 className="tituloApp">Airflow - Login</h2>

            <form className="formLogin" onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" required />

                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" required />

                <button type="submit" className="btn">Log in</button>
            </form>
        </>
    );
};
