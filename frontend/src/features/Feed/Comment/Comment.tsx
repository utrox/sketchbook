import { Divider } from "@mui/material";

import { graphqlIdToNumericId } from "../../../utils";
import PostCommentHeader from "../../../components/PostCommentHeader";
import LikeButton from "../Like/LikeButton";

export interface CommentProps {
  id: string;
  content: string;
  likeCount: number;
  likedByUser: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    avatar: string;
  };
  innerRef: any;
}

const Comment = (props: CommentProps) => {
  const commentNumericId = Number.parseInt(graphqlIdToNumericId(props.id));
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
          commentId={commentNumericId}
          likeCount={props.likeCount}
          liked={props.likedByUser}
        />
      </div>
      <Divider variant="middle" />
    </>
  );
};

export default Comment;
