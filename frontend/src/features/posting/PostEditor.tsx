import "./posteditors.css";

import { useState } from "react";
import { toast } from "react-toastify";
import ImageIcon from "@mui/icons-material/Image";
import { Button, IconButton, Container, TextField } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";

import useEditPost from "../../hooks/useEditPost";
import useCreatePost from "../../hooks/useCreatePost";
import useQueryFeed from "../../hooks/useQueryFeed";
import useQueryPostHistory from "../../hooks/useQueryPostHistory";

interface PostEditProps {
  postId?: number | null;
  initialContent?: string;
  closeModal: () => void;
  refetchFeed?: boolean;
}

const PostEditor = ({
  postId = null,
  initialContent = "",
  closeModal,
  refetchFeed,
}: PostEditProps) => {
  const [postContent, setContent] = useState(initialContent);
  const {
    editPost,
    error: updateError,
    loading: updateLoading,
  } = useEditPost();
  const {
    makePost,
    error: createError,
    loading: createLoading,
  } = useCreatePost();

  const { pathname } = useLocation();
  const { username } = useParams();

  const isProfileEditor = pathname.includes("profile");
  const refetchQueryPostHistory = useQueryPostHistory(username || "").refetch;
  const refetchQueryFeed = useQueryFeed().refetch;

  const refetch = isProfileEditor ? refetchQueryPostHistory : refetchQueryFeed;

  const submitForm = async () => {
    if (postId) {
      await editPost(postId, postContent);
    } else {
      await makePost(postContent);
    }

    if (!createError && !updateError && !createLoading && !updateLoading) {
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
    <Container className="content modal-content post-editor" maxWidth="sm">
      <h1>{postId ? "Edit a post" : "Create a post"}</h1>
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
          {postId ? "Edit" : "Post"}
        </Button>
      </div>
      {/* TODO: loading component... */}
      {createLoading && <p>Loading...</p>}
    </Container>
  );
};

export default PostEditor;
