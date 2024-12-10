import "./posteditors.css";

import { useState, forwardRef } from "react";
import { toast } from "react-toastify";
import ImageIcon from "@mui/icons-material/Image";
import { Button, IconButton, Container, TextField } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";

import useSubmitPostEditor from "../../hooks/useSubmitPostEditor";
import useRefetchPostEditor from "../../hooks/useRefetchPostEditor";

interface PostEditProps {
  postId?: number;
  initialContent?: string;
  closeModal: () => void;
  refetchFeed?: boolean;
}

const PostEditor = forwardRef<HTMLDivElement, PostEditProps>(
  ({ postId, initialContent = "", closeModal, refetchFeed }, ref) => {
    const [postContent, setContent] = useState(initialContent);

    const { pathname } = useLocation();
    const username = useParams().username || "";

    const isProfileEditor = pathname.includes("profile");

    // Submit the post to the server, based on whether the user is editing
    // an existing post or creating a new one.
    const { makeRequest, loading, error } = useSubmitPostEditor(postId);

    // Refetch the feed or the post history of the user, based on which
    // page the user is viewing. (Feed or UserProfile)
    const { refetch } = useRefetchPostEditor(isProfileEditor, username);

    const submitForm = async () => {
      await makeRequest({ postContent, postId });

      if (!error && !loading) {
        setContent("");
        toast.success(`Post ${postId ? "updated" : "created"} successfully.`);
        if (refetchFeed) refetch();
        closeModal();
      }

      if (!postId) {
        // Scroll up to the top to see freshly added Post.
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    };

    return (
      <Container
        className="content modal-content post-editor"
        maxWidth="sm"
        ref={ref}
        // Here to fix the MUI error about the modal not being able to be focused
        tabIndex={-1}
        aria-labelledby="post-editor-title"
      >
        <h1 id="post-editor-title">
          {postId ? "Edit a post" : "Create a post"}
        </h1>
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
          {/* TODO: ability to upload an image for posts */}
          <IconButton aria-label="delete">
            <ImageIcon />
          </IconButton>
          <Button variant="contained" onClick={submitForm}>
            {postId ? "Edit" : "Post"}
          </Button>
        </div>
        {/* TODO: loading component... */}
        {loading && <p>Loading...</p>}
      </Container>
    );
  }
);

export default PostEditor;
