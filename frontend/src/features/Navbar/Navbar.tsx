import "./navbar.css";

import { Navbar, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/* Icons */
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";

const MyNavbar = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/logout/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      window.location.href = "/login";
    } else {
      const data = await response.json();
      console.error("Logout error response: ", data);
    }
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
