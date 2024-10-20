import { MouseEvent, useState } from "react";
import { Container, Modal } from "@mui/material";

import Navbar from "../Navbar/Navbar";
import PostEditor from "../posting/PostEditor";
import FakePostEditor from "../posting/FakePostEditor";
import Post from "./Post";

/* TODO: remove after integration happens with API */
import { fakeData, PostType } from "./dummy_data.ts";

export function Feed() {
  const [postEditorOpen, setPostEditorOpen] = useState(false);
  const handleOpen = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    // Once the textarea was clicked and the modal opens,
    // remove the focus from the clicked element.
    (e.target as HTMLDivElement).blur();

    setPostEditorOpen(true);
  };
  const handleClose = () => setPostEditorOpen(false);

  return (
    <>
      <Navbar />
      <Container className="content" maxWidth="sm">
        <FakePostEditor onClick={(e) => handleOpen(e)} />
        <Modal open={postEditorOpen} onClose={handleClose}>
          <PostEditor />
        </Modal>
        <div className="posts">
          {fakeData.map((post: PostType) => (
            <Post key={post.node.id} {...post.node} />
          ))}
        </div>
      </Container>
    </>
  );
}
