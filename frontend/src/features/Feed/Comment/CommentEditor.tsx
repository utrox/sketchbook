import { useState } from "react";

import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";
import { Button, TextField } from "@mui/material";

import { useEditComment } from "../../../hooks/useEditComment";
import useCreateComment from "../../../hooks/useCreateComment";

interface CommentEditorPropsCreate {
  postId: number;
  commentId?: never;
  initialContent?: never;
  closeModal?: () => void;
  refetchComments?: () => void;
}

interface CommentEditorPropsUpdate {
  postId?: never;
  commentId: number;
  initialContent: string;
  closeModal?: () => void;
  refetchComments?: () => void;
}

const CommentEditor = ({
  postId,
  commentId,
  initialContent,
  closeModal,
  refetchComments,
}: CommentEditorPropsCreate | CommentEditorPropsUpdate) => {
  const [commentContent, setCommentContent] = useState<string>(
    initialContent || ""
  );

  const {
    editComment,
    error: updateError,
    loading: updateLoading,
  } = useEditComment();
  const {
    makeComment,
    error: createError,
    loading: createLoading,
  } = useCreateComment();

  /*
  TODO: when adding or removing a comment, the comment counter of the Post is 
  not updated. It gets updated only when the the next 15 second interval's request polls the data.
  Maybe make a hook to update the feed data? Or maybe add/subtract the comment count in the cache?
  */
  const submitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (commentId) {
      await editComment(commentId, commentContent);
    } else if (postId) {
      await makeComment(postId, commentContent);
    } else {
      toast.error("No post ID and no comment ID provided.");
    }

    if (!updateError && !createError && !createLoading && !updateLoading) {
      setCommentContent("");
      toast.success("Comment created successfully.");
      refetchComments && refetchComments();
      /* TODO: after commenting, scroll up to see the newly added comment, using ref? */
      closeModal && closeModal();
    }
  };

  return (
    <div className="comment-editor">
      <TextField
        multiline
        minRows={2}
        label="Comment"
        variant="outlined"
        fullWidth
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
      />
      <Button onClick={(e) => submitForm(e)}>
        <SendIcon />
      </Button>
    </div>
  );
};

export default CommentEditor;
