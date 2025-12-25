import { Navigate } from 'react-router';
import { useCookies } from 'react-cookie';
import { jwtDecode } from "jwt-decode";

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
