import { useState, useEffect } from "react";
import { Divider, List, DialogTitle } from "@mui/material";

import useQueryLikers from "../../../hooks/useQueryLikers";
import InfiniteScroll from "../../../components/InfiniteScroll";
import Liker from "./Liker";
import LikeType from "../../../api/graphQL/types/LikeType";
import "./likes.css";

interface LikersModalProps {
  postId?: number;
  commentId?: number;
}

const LikersModal = ({ postId, commentId }: LikersModalProps) => {
  const [likers, setLikers] = useState([]);

  /* Depending on whether we are querying likers for a post or comment,
  access the data differently. */
  const queryPropertyName = postId ? "allLikersForPost" : "allLikersForComment";
  const { data, loading, loadMoreItems } = useQueryLikers({
    postId,
    commentId,
    queryPropertyName,
  });

  useEffect(() => {
    if (data) {
      setLikers(
        data[queryPropertyName].edges.map(
          (edge: { node: LikeType }) => edge.node
        )
      );
    }
  }, [data]);

  return (
    <div className="likers-modal">
      <DialogTitle>Likers:</DialogTitle>
      <Divider />
      <List>
        <InfiniteScroll
          items={likers}
          loading={loading}
          ItemComponent={Liker}
          itemProps={{}}
          hasMore={data?.[queryPropertyName].pageInfo.hasNextPage}
          loadMoreItems={loadMoreItems}
          loadingComponent={<div>Loading...</div>}
          hasNoElementComponent={<div>No likers.</div>}
        />
      </List>
    </div>
  );
};

export default LikersModal;
