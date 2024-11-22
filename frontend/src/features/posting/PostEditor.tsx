import "./posteditors.css";

import { useState } from "react";
import { Button, IconButton, Container, TextField } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

import {
  CREATE_POST_MUTATION,
  EDIT_POST_MUTATION,
} from "../../api/graphQL/mutations/post";

interface PostEditProps {
  postId?: number | null;
  initialContent?: string;
  closeModal: () => void;
  refetchFeed?: () => void;
}

const PostEditor = ({
  postId = null,
  initialContent = "",
  closeModal,
  refetchFeed,
}: PostEditProps) => {
  const [postContent, setContent] = useState(initialContent);
  const [createPost, { error, loading }] = useMutation(CREATE_POST_MUTATION);
  const [updatePost, { error: updateError, loading: updateLoading }] =
    useMutation(EDIT_POST_MUTATION);

  const makePost = async () => {
    await createPost({
      variables: { content: postContent },
    });

    if (!error && !loading) {
      setContent("");
      toast.success("Post created successfully.");
      refetchFeed && refetchFeed();
      closeModal();
      // Scroll up to the top to see freshly added Post.
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  };

  // TODO: Should this be a hook?
  const editPost = async () => {
    await updatePost({
      variables: { id: postId, content: postContent },
      update: (cache) => {
        cache.modify({
          fields: {
            feed(existingFeed = { edges: [] }, { readField }) {
              return {
                edges: existingFeed.edges.map((edge: any) => {
                  if (postId === readField("postId", edge.node)) {
                    return {
                      ...edge,
                      node: {
                        ...edge.node,
                        content: postContent,
                      },
                    };
                  }
                  return edge;
                }),
              };
            },
          },
        });
      },
    });

    if (!updateError && !updateLoading) {
      setContent("");
      toast.success("Post modified successfully.");
      refetchFeed && refetchFeed();
      closeModal();
    }
  };

  const submitForm = postId ? editPost : makePost;

  return (
    <Container className="content modal-content" maxWidth="sm">
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
      {loading && <p>Loading...</p>}
    </Container>
  );
};

export default PostEditor;
