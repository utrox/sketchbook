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
          src={`${import.meta.env.VITE_BACKEND_URL}/${props.user.avatar}`}
        />
      </Link>
      <div>
        <Link to={`/profile/${props.user.username}`}>
          <p className="username">{props.user.username}</p>
        </Link>
        <div>
          {simplifyCreationEditionTime(props.createdAt, props.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default PostCommentHeader;
