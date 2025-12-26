import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

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
