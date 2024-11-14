import "./post.css";

import { graphqlIdToNumericId } from "../../utils";
import CommentsButton from "./Comment/CommentsButton";
import LikeButton from "./Like/LikeButton";
import PostCommentHeader from "../../components/PostCommentHeader";

interface PostData {
  id: string;
  content: string;
  image: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  innerRef: any;
}

const Post = (props: PostData) => {
  const postNumericId = graphqlIdToNumericId(props.id);
  return (
    <div className="post-body" ref={props.innerRef}>
      <PostCommentHeader
        user={props.user}
        createdAt={props.createdAt}
        updatedAt={props.updatedAt}
      />
      <p>{props.content}</p>
      <div className="bottom-bar">
        {/* TODO: add liking functionality when integrating */}
        <LikeButton
          postId={postNumericId}
          likeCount={props.likeCount}
          onClick={() => {}}
        />
        <CommentsButton
          postId={postNumericId}
          commentCount={props.commentCount}
        />
      </div>
    </div>
  );
};

export default Post;
