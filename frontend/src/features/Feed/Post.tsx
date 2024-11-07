import "./post.css";

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
          postId={props.id}
          likeCount={props.likeCount}
          onClick={() => {}}
        />
        <CommentsButton postId={props.id} commentCount={props.commentCount} />
      </div>
    </div>
  );
};

export default Post;
