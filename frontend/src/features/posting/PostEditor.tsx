import "./posteditors.css";

import { useState } from "react";
import { Button, IconButton, Container, TextField } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

interface PostEditProps {
  id?: number | null;
  content?: string;
}

const PostEditor = ({ id = null, content = "" }: PostEditProps) => {
  const [postContent, setContent] = useState(content);

  return (
    <Container className="content modal-content" maxWidth="sm">
      <h1>{id ? "Edit a post" : "Create a post"}</h1>
      <TextField
        fullWidth
        multiline
        minRows={3}
        label="Post content"
        id="fullWidth"
        value={postContent}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="btns">
        {/* TODO: ability to upload an image + possilbly drag & drop? */}
        <IconButton aria-label="delete">
          <ImageIcon />
        </IconButton>
        {/* TODO: create the post API call */}
        <Button variant="contained">{id ? "Edit" : "Post"}</Button>
      </div>
    </Container>
  );
};

export default PostEditor;
