import "./index.css";

import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import { simplifyCreationEditionTime } from "./TimePassed";

interface PostCommentHeaderProps {
  user: {
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PostCommentHeader = (props: PostCommentHeaderProps) => {
  return (
    <div className="poster-data">
      <Link to={`/profile/${props.user.username}`}>
        <Avatar
          alt={props.user.username}
          /* TODO: production link image */
          src={`http://127.0.0.1:8000/${props.user.avatar}`}
        />
      </Link>
      <div>
        <Link to={`/profile/${props.user.username}`}>
          <p className="username">{props.user.username}</p>
        </Link>
        <p>{simplifyCreationEditionTime(props.createdAt, props.updatedAt)}</p>
      </div>
    </div>
  );
};

export default PostCommentHeader;
