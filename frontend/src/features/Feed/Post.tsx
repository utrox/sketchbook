// Lib imports
import { useState } from "react";
import { Modal } from "@mui/material";
import { graphqlIdToNumericId } from "../../utils";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useDeletePost } from "../../hooks/useDeletePost";

// Components
import LikeButton from "./Like/LikeButton";
import PostEditor from "../posting/PostEditor";
import CommentsButton from "./Comment/CommentsButton";
import ManagementButtons from "../../components/ManagementButtons";
import PostCommentHeader from "../../components/PostCommentHeader";

interface PostData {
  id: string;
  content: string;
  image: string;
  likeCount: number;
  likedByUser: boolean;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  innerRef: React.RefObject<HTMLDivElement>;
}

const Post = (props: PostData) => {
  const postNumericId = Number.parseInt(graphqlIdToNumericId(props.id));
  const { user, loading } = useAuth();
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);

  const { deletePost } = useDeletePost(postNumericId);

  return (
    <div className="post-body" ref={props.innerRef}>
      <PostCommentHeader
        user={props.user}
        createdAt={props.createdAt}
        updatedAt={props.updatedAt}
      />
      <p>{props.content}</p>
      <div className="bottom-bar">
        <LikeButton
          postId={postNumericId}
          liked={props.likedByUser}
          likeCount={props.likeCount}
        />
        <CommentsButton
          postId={postNumericId}
          commentCount={props.commentCount}
        />
        {!loading && props.user.id == user.id && (
          <>
            <ManagementButtons
              onEdit={() => setIsPostEditorOpen(true)}
              onDelete={deletePost}
              entityType="post"
            />

            <Modal
              open={isPostEditorOpen}
              onClose={() => setIsPostEditorOpen(false)}
            >
              <PostEditor
                postId={postNumericId}
                closeModal={() => setIsPostEditorOpen(false)}
                initialContent={props.content}
                refetchFeed
              />
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
