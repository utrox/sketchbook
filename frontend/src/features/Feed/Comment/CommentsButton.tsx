import "./comments.css";
import Comments from "./CommentsModal";

import { useState } from "react";
import { IconButton, Modal } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

interface CommentsButtonProps {
  postId: string;
  commentCount: number;
}

/* TODO: maybe rename it? It's not really a button, but kinda is? */
const CommentsButton = ({ postId, commentCount }: CommentsButtonProps) => {
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const openModal = () => setCommentsModalOpen(true);
  const closeModal = () => setCommentsModalOpen(false);

  return (
    <>
      <IconButton onClick={openModal}>
        <CommentIcon className="comment-icon" />
      </IconButton>
      <span className="comments" onClick={openModal}>
        {commentCount} comments
      </span>
      <Modal open={commentsModalOpen} onClose={closeModal}>
        <Comments postId={postId} />
      </Modal>
    </>
  );
};

export default CommentsButton;
