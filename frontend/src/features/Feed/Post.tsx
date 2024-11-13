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
  /*
  The GraphQL graphene relay Node overrides the id field
  of the object and returns a base64 encoded string
  representing the type of the object and the id in form
  of type:id. We need the numeric ID for further operations, 
  so we read it from the base64 encoded string.
 */
  const postNumericId = atob(props.id).split(":")[1];
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
        <CommentsButton
          postId={postNumericId}
          commentCount={props.commentCount}
        />
      </div>
    </div>
  );
};

export default Post;
