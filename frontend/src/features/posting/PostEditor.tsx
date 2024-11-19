import "./posteditors.css";

import { useState } from "react";
import { Button, IconButton, Container, TextField } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

import { CREATE_POST_MUTATION } from "../../api/graphQL/mutations/post";

interface PostEditProps {
  id?: number | null;
  content?: string;
  closeModal: () => void;
  refetchFeed: () => void;
}

const PostEditor = ({
  id = null,
  content = "",
  closeModal,
  refetchFeed,
}: PostEditProps) => {
  const [postContent, setContent] = useState(content);
  const [createPost, { error, loading }] = useMutation(CREATE_POST_MUTATION);

  const submitForm = async () => {
    await createPost({
      variables: { content: postContent },
    });

    if (!error && !loading) {
      setContent("");
      toast.success("Post created successfully.");
      refetchFeed();
      closeModal();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  };

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
        <Button variant="contained" onClick={submitForm}>
          {id ? "Edit" : "Post"}
        </Button>
      </div>
      {/* TODO: loading component... */}
      {loading && <p>Loading...</p>}
    </Container>
  );
};

export default PostEditor;
