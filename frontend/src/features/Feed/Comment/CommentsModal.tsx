import { useEffect, useState, forwardRef } from "react";
import { DialogTitle, Divider, List, Container } from "@mui/material";

import useQueryComments from "../../../hooks/useQueryComments.ts";
import Comment, { CommentProps } from "./Comment.tsx";
import CommentEditor from "./CommentEditor.tsx";
import { CommentType } from "../../../api/graphQL/types/CommentType.ts";
import InfiniteScroll from "../../../components/InfiniteScroll.tsx";

interface CommentsModalProps {
  postId: number;
}

const CommentsModal = forwardRef<HTMLDivElement, CommentsModalProps>(
  ({ postId }, ref) => {
    const [comments, setComments] = useState<CommentProps[]>([]);
    const { data, loading, loadMoreItems, refetch } = useQueryComments(postId);

    useEffect(() => {
      if (data) {
        setComments(
          data.allCommentsForPost.edges.map(
            (edge: { node: CommentType }) => edge.node
          )
        );
      }
    }, [data]);

    return (
      <Container
        maxWidth="sm"
        className="comments-modal"
        ref={ref}
        // Here to fix the MUI error about the modal not being able to be focused
        tabIndex={-1}
        aria-labelledby="comments-modal-title"
      >
        <DialogTitle id="comments-modal-title">Comments</DialogTitle>
        <Divider />
        <List>
          <InfiniteScroll
            items={comments}
            loading={loading}
            ItemComponent={Comment}
            itemProps={{}}
            hasMore={data?.allCommentsForPost.pageInfo.hasNextPage}
            loadMoreItems={loadMoreItems}
            loadingComponent={<div>Loading...</div>}
            hasNoElementComponent={<div>No comments</div>}
          />
        </List>
        <CommentEditor postId={postId} refetchComments={refetch} />
      </Container>
    );
  }
);

export default CommentsModal;
