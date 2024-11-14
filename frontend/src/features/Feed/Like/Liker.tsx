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
  innerRef: any;
}

const Liker = (props: LikerProps) => {
  return (
    /* TODO: formatting when its empty, etc. */
    <ListItem key={props.user.username} className="liker">
      <Link to={`/profile/${props.user.username}`}>
        <ListItemButton onClick={() => {}}>
          <ListItemAvatar>
            <Avatar
              /* TODO: user avatar */
              src={`http://127.0.0.1:8000/${props.user.avatar}`}
              alt={props.user.username}
            />
          </ListItemAvatar>
          <p className="username" ref={props.innerRef}>
            {props.user.username}
          </p>
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

export default Liker;
