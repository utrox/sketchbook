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
    username: string;
    avatar: string;
  };
}

const Post = (props: PostData) => {
  return (
    <div className="post-body">
      {/* TODO: Poster-data could be its own component - reusable for Comment.tsx later on  */}
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

        {/* TODO: open Comments component as Modal */}
        <CommentsButton postId={props.id} commentCount={props.commentCount} />
      </div>
    </div>
  );
};

export default Post;
