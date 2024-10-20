import "./navbar.css";

import { Navbar, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";

/* Icons */
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";

const MyNavbar = () => {
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
          to="/profile/username"
          className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
        >
          {/* TODO: replace with actual user profile image */}
          <Image
            className="nav-pfp"
            src="https://cdn.drawception.com/images/panels/2016/7-17/ZTXNs73bym-3.png"
            roundedCircle
          />
        </NavLink>
      </div>
    </Navbar>
  );
};

export default MyNavbar;
