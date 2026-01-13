import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import "../css/LogoutButton.css"

/**
 * Componente LogoutButton
 *
 * Botón que permite al usuario cerrar sesión.
 * Al hacer clic:
 * - Elimina la cookie "token" (autenticación)
 * - Redirige al usuario a la página principal "/"
 *
 * @component
 * @returns {JSX.Element} Botón de logout
 */
export const LogoutButton = () => {
  const [, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  /**
   * Función que realiza el cierre de sesión
   * - Elimina la cookie "token"
   * - Redirige a la página principal usando useNavigate
   */
  const logout = () => {
    removeCookie("token", { path: "/" });
    navigate("/");
  };

  return (
    <button className="btn-logout" onClick={logout}>
      Logout
    </button>
  );
};
