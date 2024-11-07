import "./navbar.css";

import { Navbar, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../api/graphQL/queries/auth";

/* Icons */
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";

const MyNavbar = () => {
  const { user } = useAuth();

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
        <NavLink
          to="/notifications"
          className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
        >
          <NotificationsIcon className="nav-icon" />
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
        >
          <MessageIcon className="nav-icon" />
        </NavLink>
        <NavLink
          to={`/profile/${user.username}/`}
          className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
        >
          <Image
            className="nav-pfp"
            /* TODO: gonna be different in production */
            src={`http://127.0.0.1:8000/${user.avatar}`}
            roundedCircle
          />
        </NavLink>
      </div>
    </Navbar>
  );
};

export default MyNavbar;
