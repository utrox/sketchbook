import { useEffect, useState } from "react";
import { DialogTitle, Divider, List, Container } from "@mui/material";

import useQueryComments from "../../../hooks/useQueryComments.ts";
import Comment, { CommentProps } from "./Comment.tsx";
import CommentEditor from "./CommentEditor.tsx";
import { CommentType } from "../../../api/graphQL/types/CommentType.ts";
import InfiniteScroll from "../../../components/InfiniteScroll.tsx";

const CommentsModal = ({ postId }: { postId: number }) => {
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
    <Container maxWidth="sm" className="comments-modal">
      <DialogTitle>Comments</DialogTitle>
      <Divider />
      <List>
        {/* TODO: 'No comments' doesnt fill up enough space, so the CommentEditor component is just in the middle vertically */}
        {/* TODO: when only one comment exists, the same issue persists (doesnt fill the component enough vetically) */}
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
};

export default CommentsModal;
