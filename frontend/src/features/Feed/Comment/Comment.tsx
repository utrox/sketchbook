import { Divider } from "@mui/material";

import PostCommentHeader from "../../../components/PostCommentHeader";
import LikeButton from "../Like/LikeButton";

export interface CommentProps {
  id: string;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    avatar: string;
  };
  innerRef: any;
}

const Comment = (props: CommentProps) => {
  return (
    <>
      <div ref={props.innerRef}>
        <PostCommentHeader
          user={props.user}
          createdAt={props.createdAt}
          updatedAt={props.updatedAt}
        />
        <p>{props.content}</p>
        <LikeButton
          commentId={props.id}
          likeCount={props.likeCount}
          onClick={() => {}}
        />
      </div>
      <Divider variant="middle" />
    </>
  );
};

export default Comment;
