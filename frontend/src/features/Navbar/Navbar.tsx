import "./navbar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Image } from "react-bootstrap";

import { fetchWithHandling } from "../../utils";
import { useAuth } from "../../hooks/useAuth";

/* Icons */
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";

const MyNavbar = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await fetchWithHandling(
      `${import.meta.env.VITE_BACKEND_URL}/auth/logout/`,
      { method: "POST" },
      "Logout successful.",
      () => (window.location.href = "/login")
    );
  };

  return (
    <Navbar>
      <NavLink to="/">
        <h1 id="logo">sketchbook</h1>
      </NavLink>
      <div className="nav-btns">
        <NavLink
          to="/"
          className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
        >
          <HomeIcon className="nav-icon" />
        </NavLink>
        <LogoutIcon className="nav-icon" onClick={handleLogout} />
        <NavLink
          to={`/profile/${user.username}/`}
          className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
        >
          <Image
            className="nav-pfp"
            src={`${import.meta.env.VITE_BACKEND_URL}/${user.avatar}`}
            roundedCircle
          />
        </NavLink>
      </div>
    </Navbar>
  );
};

export default MyNavbar;
