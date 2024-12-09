import { forwardRef } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  ListItemAvatar,
  ListItem,
  ListItemButton,
} from "@mui/material";

interface LikerProps {
  user: {
    username: string;
    avatar: string;
  };
}

const Liker = forwardRef<HTMLDivElement, LikerProps>((props, ref) => {
  return (
    /* TODO: formatting when its empty, etc. */
    <ListItem key={props.user.username} className="liker">
      <Link to={`/profile/${props.user.username}`}>
        <ListItemButton onClick={() => {}}>
          <ListItemAvatar>
            <Avatar
              src={`${import.meta.env.VITE_BACKEND_URL}/${props.user.avatar}`}
              alt={props.user.username}
            />
          </ListItemAvatar>
          <p className="username" ref={ref}>
            {props.user.username}
          </p>
        </ListItemButton>
      </Link>
    </ListItem>
  );
});

export default Liker;
