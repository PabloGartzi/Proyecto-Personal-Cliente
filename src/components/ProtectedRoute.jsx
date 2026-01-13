import { Navigate } from 'react-router';
import { useCookies } from 'react-cookie';
import { jwtDecode } from "jwt-decode";

/**
 * Componente ProtectedRoute
 *
 * Controla el acceso a rutas según el rol del usuario.
 * - Recibe `children` (el componente a renderizar si está autorizado)
 * - Recibe `allowedRoles` (array con roles permitidos)
 *
 * @param {JSX.Element} children - Componente protegido
 * @param {Array<string>} allowedRoles - Roles permitidos para acceder
 * @returns {JSX.Element} - Children si autorizado, o <Navigate> si no lo está
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const [{ token }] = useCookies(['token']);

  // No hay token → me redirige al login
  if (!token) return <Navigate to="/login" replace />;
  const decoded = jwtDecode(token);
  const rol = decoded.rol; 

  // Rol no permitido → me redirige a home
  if (allowedRoles && allowedRoles.includes(rol)) return children;
  
  return <Navigate to="/" replace />;
}
