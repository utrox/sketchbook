import "./post.css";

import { Link } from "react-router-dom";
import { Avatar, IconButton } from "@mui/material";
import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";

import { simplifyCreationEditionTime } from "../../components/TimePassed";

interface PostData {
  id: string;
  content: string;
  image: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    avatar: string;
  };
}

const Post = (props: PostData) => {
  return (
    <div className="post-body">
      {/* TODO: Poster-data could be its own component - reusable for Comment.tsx later on  */}
      <div className="poster-data">
        <Link to="/profile/TODO:username">
          {/* TODO: make sure the avatar is for the correct user */}
          <Avatar
            alt="TODO: username"
            src={
              props.image ||
              `https://picsum.photos/id/${Math.floor(
                Math.random() * 800
              )}/200/400`
            }
          />
        </Link>
        <div>
          <Link to="/profile/TODO:username">
            <p className="username">{props.user.username}</p>
          </Link>
          <p>{simplifyCreationEditionTime(props.createdAt, props.updatedAt)}</p>
        </div>
      </div>
      <p>{props.content}</p>
      <div className="bottom-bar">
        {/* TODO: add liking functionality when integrating */}
        <IconButton>
          {/* TODO: FaviouriteIcon vs FavouriteBorderIcon depending on weather the current user liked the post or not */}
          <FavouriteBorderIcon />
        </IconButton>
        {/* TODO: open list of likers as Modal */}
        <span className="liketext">{props.likeCount}</span>
        {/* TODO: open Comments component as Modal */}
        <IconButton>
          <CommentIcon />
        </IconButton>
        <span>{props.commentCount} comments</span>
      </div>
    </div>
  );
};

export default Post;
