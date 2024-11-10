import { MouseEvent, useState, useRef, useCallback, useEffect } from "react";
import { Container, Modal } from "@mui/material";
import { useQuery } from "@apollo/client";

import Navbar from "../Navbar/Navbar";
import PostEditor from "../posting/PostEditor";
import FakePostEditor from "../posting/FakePostEditor";
import Post from "./Post";
import { GET_FEED_DATA } from "../../api/graphQL/queries/feed.tsx";
import FeedPostType from "../../api/graphQL/types/FeedPostType.ts";

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

  /* Infinite scroll */
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostComponentRef = useCallback(
    (element: HTMLDivElement) => {
      if (loading) return;
      /* Remove observer from current last element */
      if (observer.current) observer.current.disconnect();
      /* Fetch more data, new Posts will be rendered */
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      });
      /* Add it to the new last element. */
      if (element) observer.current.observe(element);
    },
    [loading]
  );

  return (
    <>
      <Navbar />
      <Container className="content" maxWidth="sm">
        <FakePostEditor onClick={(e) => handleOpen(e)} />
        <Modal open={postEditorOpen} onClose={handleClose}>
          <PostEditor closeModal={handleClose} refetchFeed={refetch} />
        </Modal>
        <div className="posts">
          {data &&
            items.map((post: FeedPostType, index: number) => (
              <Post
                key={post.id}
                {...post}
                /* Set it up so that only the last one has the ref. */
                innerRef={
                  index === items.length - 1 ? lastPostComponentRef : null
                }
              />
            ))}
        </div>
        {/* TODO better component for showing these messages */}
        {items.length === 0 && !loading && <p>No posts yet.</p>}
        {!data?.feed?.pageInfo?.hasNextPage && <p>No more posts.</p>}
        {/* TODO: loading component */}
        {loading && <p>Loading...</p>}
      </Container>
    </>
  );
}
