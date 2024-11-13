import { useQuery } from "@apollo/client";
import { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { DialogTitle, Divider, List, Container } from "@mui/material";

import Comment, { CommentProps } from "./Comment.tsx";
import CommentEditor from "./CommentEditor.tsx";
import CommentType from "../../../api/graphQL/types/CommentType.ts";
import { GET_COMMENTS_FOR_POST } from "../../../api/graphQL/queries/comment.ts";

const CommentsModal = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  /* Fetch comments */
  const { data, loading, fetchMore, refetch } = useQuery(
    GET_COMMENTS_FOR_POST,
    {
      variables: {
        after: null,
        postId: postId,
        first: 5,
      },
      // Refetch every 15 seconds TODO: set it to more frequent?
      pollInterval: 15000,
      // Allows for loading state changes on fetchMore
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (data) {
      setComments(
        data.allCommentsForPost.edges.map(
          (edge: { node: CommentType }) => edge.node
        )
      );
    }
  }, [data]);

  const loadMoreItems = () => {
    if (data.allCommentsForPost.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.allCommentsForPost.pageInfo.endCursor,
          postId: postId,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            allCommentsForPost: {
              ...fetchMoreResult.allCommentsForPost,
              edges: [
                ...prevResult.allCommentsForPost.edges,
                ...fetchMoreResult.allCommentsForPost.edges,
              ],
            },
          };
        },
      });
    }
  };

  /* Infinite scroll implementation */
  /* TODO: make reusable useInfiniteScroll hook instead? */
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostComponentRef = useCallback(
    (element: HTMLDivElement) => {
      console.log("observer: ", observer);
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
    <Container maxWidth="sm" className="comments-modal">
      <DialogTitle>Comments</DialogTitle>
      <Divider />
      <List>
        {/* TODO: 'No comments' doesnt fill up enough space, so the CommentEditor component is just in the middle vertically */}
        {/* TODO: when only one comment exists, the same issue persists (doesnt fill the component enough vetically) */}
        {comments.length === 0 && <p className="no-comments">No comments</p>}
        {comments.map((comment, index) => (
          <Fragment key={comment.id}>
            <Comment
              key={`${comment.id}-${index}`}
              {...comment}
              innerRef={
                index === comments.length - 1 ? lastPostComponentRef : null
              }
            />
            <Divider variant="middle" />
          </Fragment>
        ))}
      </List>
      {/* TODO: comment editor at the bottom, but fixed, so that you dont gotta scroll all the way to the bottom of all comments */}
      <CommentEditor onSubmit={() => {}} />
    </Container>
  );
};

export default CommentsModal;
