import { useState } from "react";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const CommentEditor = ({
  onSubmit,
}: {
  onSubmit: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const [commentContent, setCommentContent] = useState("");
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
