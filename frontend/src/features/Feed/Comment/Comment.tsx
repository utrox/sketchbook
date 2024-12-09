import { useState, forwardRef } from "react";
import { Divider, Modal, Container } from "@mui/material";

// Hooks
import { useAuth } from "../../../hooks/useAuth";
import { graphqlIdToNumericId } from "../../../utils";
import { useDeleteComment } from "../../../hooks/useDeleteComment";

// Components
import CommentEditor from "./CommentEditor";
import LikeButton from "../Like/LikeButton";
import PostCommentHeader from "../../../components/PostCommentHeader";
import ManagementButtons from "../../../components/ManagementButtons";

export interface CommentProps {
  id: string;
  content: string;
  likeCount: number;
  likedByUser: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
}

const Comment = forwardRef<HTMLDivElement, CommentProps>((props, ref) => {
  const commentNumericId = Number.parseInt(graphqlIdToNumericId(props.id));

  const { user, loading } = useAuth();
  const [isCommentEditorOpen, setIsCommentEditorOpen] = useState(false);

  const { deleteComment } = useDeleteComment(commentNumericId);

  return (
    <>
      <div ref={ref}>
        <PostCommentHeader
          user={props.user}
          createdAt={props.createdAt}
          updatedAt={props.updatedAt}
        />
        <p>{props.content}</p>
        <div className="bottom-bar">
          <LikeButton
            commentId={commentNumericId}
            likeCount={props.likeCount}
            liked={props.likedByUser}
          />
          {!loading && props.user.id == user.id && (
            <>
              <ManagementButtons
                onEdit={() => setIsCommentEditorOpen(true)}
                onDelete={deleteComment}
                entityType="comment"
              />
              <Modal
                open={isCommentEditorOpen}
                onClose={() => setIsCommentEditorOpen(false)}
              >
                <Container
                  className="content modal-content post-editor"
                  maxWidth="sm"
                >
                  <h1>Edit comment</h1>
                  <CommentEditor
                    commentId={commentNumericId}
                    closeModal={() => setIsCommentEditorOpen(false)}
                    initialContent={props.content}
                  />
                </Container>
              </Modal>
            </>
          )}
        </div>
      </div>
      <Divider variant="middle" />
    </>
  );
});

export default Comment;
