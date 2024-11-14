import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Divider, List, DialogTitle } from "@mui/material";

import {
  GET_LIKERS_FOR_COMMENT,
  GET_LIKERS_FOR_POST,
} from "../../../api/graphQL/queries/likers";
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
  /*
  Depending on if this is a Likers modal for a Comment or Post, 
  request and access the data differently 
  */
  const QUERY_TO_USE = postId ? GET_LIKERS_FOR_POST : GET_LIKERS_FOR_COMMENT;
  const queryPropertyName = postId ? "allLikersForPost" : "allLikersForComment";

  const { data, loading, fetchMore } = useQuery(QUERY_TO_USE, {
    variables: {
      postId: postId,
      commentId: commentId,
      first: 10,
    },
    pollInterval: 15000,
    notifyOnNetworkStatusChange: true,
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

  const loadMoreItems = () => {
    if (data[queryPropertyName].pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data[queryPropertyName].pageInfo.endCursor,
          postId: postId,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            [queryPropertyName]: {
              ...fetchMoreResult[queryPropertyName],
              edges: [
                ...prevResult[queryPropertyName].edges,
                ...fetchMoreResult[queryPropertyName].edges,
              ],
            },
          };
        },
      });
    }
  };

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
