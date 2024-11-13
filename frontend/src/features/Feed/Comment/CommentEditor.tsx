import { useState } from "react";
import { useMutation } from "@apollo/client";
import SendIcon from "@mui/icons-material/Send";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";

import { CREATE_COMMENT_MUTATION } from "../../../api/graphQL/mutations/comment";

interface CommentEditorProps {
  postId: string;
  commentId?: string;
  refetchComments: () => void;
}

const CommentEditor = ({
  postId,
  commentId,
  refetchComments,
}: CommentEditorProps) => {
  const [commentContent, setCommentContent] = useState("");
  const [createComment, { error, loading }] = useMutation(
    CREATE_COMMENT_MUTATION
  );

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (postId && commentContent) {
      await createComment({
        variables: { postId: Number.parseInt(postId), content: commentContent },
      });

      /*
      TODO: when adding a comment, the comment Counter of the Post is not updated after the next 15 second interval's request does not update it.
      Maybe make a hook to update the feed data?
       */
      if (!error && !loading) {
        setCommentContent("");
        toast.success("Comment created successfully.");
        refetchComments();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
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
      {/* TOOD: When clicking this button, post the comment. */}
      <Button onClick={(e) => onSubmit(e)}>
        <SendIcon />
      </Button>
    </div>
  );
};

export default CommentEditor;
