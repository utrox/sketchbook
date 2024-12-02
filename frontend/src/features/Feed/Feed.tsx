import { MouseEvent, useState, useEffect } from "react";
import { Container, Modal } from "@mui/material";

import Navbar from "../Navbar/Navbar";
import PostEditor from "../posting/PostEditor";
import FakePostEditor from "../posting/FakePostEditor";
import Post from "./Post";
import FeedPostType from "../../api/graphQL/types/FeedPostType.ts";
import InfiniteScroll from "../../components/InfiniteScroll.tsx";
import useQueryFeed from "../../hooks/useQueryFeed.ts";

export function Feed() {
  const [postEditorOpen, setPostEditorOpen] = useState(false);
  const [items, setItems] = useState([]);

  const handleOpen = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    // Once the textarea was clicked and the modal opens,
    // remove the focus from the clicked element.
    (e.target as HTMLDivElement).blur();

    setPostEditorOpen(true);
  };
  const handleClose = () => setPostEditorOpen(false);

  const { data, loading, loadMoreItems } = useQueryFeed();

  useEffect(() => {
    if (data) {
      setItems(
        data.feed.edges.map((edge: { node: FeedPostType }) => edge.node)
      );
    }
  }, [data]);

  return (
    <>
      <Navbar />
      <Container className="content" maxWidth="sm">
        <FakePostEditor onClick={(e) => handleOpen(e)} />
        <Modal open={postEditorOpen} onClose={handleClose}>
          <PostEditor closeModal={handleClose} refetchFeed={true} />
        </Modal>
        <div className="posts">
          <InfiniteScroll
            items={items}
            loading={loading}
            ItemComponent={Post}
            itemProps={{}}
            hasMore={data?.feed?.pageInfo?.hasNextPage}
            loadMoreItems={loadMoreItems}
            /* TODO better component for showing these messages, and loading  */
            loadingComponent={<div>Loading...</div>}
            hasNoElementComponent={<div>No posts yet...</div>}
            hasNoMoreComponent={<div>No more posts</div>}
          />
        </div>
      </Container>
    </>
  );
}
