import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import "../css/LogoutButton.css"

export const LogoutButton = () => {
  const [, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

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
