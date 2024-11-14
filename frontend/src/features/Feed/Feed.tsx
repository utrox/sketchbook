import { MouseEvent, useState, useEffect } from "react";
import { Container, Modal } from "@mui/material";
import { useQuery } from "@apollo/client";

import Navbar from "../Navbar/Navbar";
import PostEditor from "../posting/PostEditor";
import FakePostEditor from "../posting/FakePostEditor";
import Post from "./Post";
import { GET_FEED_DATA } from "../../api/graphQL/queries/feed.ts";
import FeedPostType from "../../api/graphQL/types/FeedPostType.ts";
import InfiniteScroll from "../../components/InfiniteScroll.tsx";

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

  /* TODO: Possibly refactor this into a hook, like useAuth? */
  const { data, loading, fetchMore, refetch } = useQuery(GET_FEED_DATA, {
    variables: { first: 10 },
    // Refetch every 15 seconds TODO: set it to more frequent?
    pollInterval: 15000,
    // Allows for loading state changes on fetchMore
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data) {
      setItems(
        data.feed.edges.map((edge: { node: FeedPostType }) => edge.node)
      );
    }
  }, [data]);

  /* Cursor-based pagination, refetch next items from the last one */
  const loadMoreItems = () => {
    if (data.feed.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.feed.pageInfo.endCursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            feed: {
              ...fetchMoreResult.feed,
              edges: [...prevResult.feed.edges, ...fetchMoreResult.feed.edges],
            },
          };
        },
      });
    }
  };

  return (
    <>
      <Navbar />
      <Container className="content" maxWidth="sm">
        <FakePostEditor onClick={(e) => handleOpen(e)} />
        <Modal open={postEditorOpen} onClose={handleClose}>
          <PostEditor closeModal={handleClose} refetchFeed={refetch} />
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
