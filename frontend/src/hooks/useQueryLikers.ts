import { useState } from "react";
import { useQuery } from "@apollo/client";

import {
  GET_LIKERS_FOR_COMMENT,
  GET_LIKERS_FOR_POST,
} from "../api/graphQL/queries/likers";

interface QueryProps {
  postId?: number;
  commentId?: number;
  queryPropertyName: string;
}

interface QueryVariables extends QueryProps {
  first: number;
}

const LOAD_AT_ONCE_COUNT = 10;
const REFETCH_INTERVAL = 15_000;

/* See comment in useQueryFeed.ts as why this solution was used. */
const useQueryLikers = ({
  postId,
  commentId,
  queryPropertyName,
}: QueryProps) => {
  /*
  Depending on if this is a Likers modal for a Comment or Post, 
  request the data differently.
  */
  const QUERY_TO_USE = postId ? GET_LIKERS_FOR_POST : GET_LIKERS_FOR_COMMENT;

  const [variables, setVariables] = useState<QueryVariables>({
    first: LOAD_AT_ONCE_COUNT,
    postId: postId,
    commentId: commentId,
    queryPropertyName: queryPropertyName,
  });

  const handleQueryVariableChange = (newVariables: QueryVariables) => {
    setVariables(newVariables);
    stopPolling();
    startPolling(REFETCH_INTERVAL);
  };

  const { data, loading, fetchMore, stopPolling, startPolling } = useQuery(
    QUERY_TO_USE,
    {
      variables: variables,
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        startPolling(REFETCH_INTERVAL);
      },
    }
  );

  const loadMoreItems = () => {
    if (data[queryPropertyName].pageInfo.hasNextPage) {
      fetchMore({
        // postId and commentId gets reused from the initial query by default.
        variables: {
          first: LOAD_AT_ONCE_COUNT,
          after: data[queryPropertyName].pageInfo.endCursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          // Update how many items to refetch with polling.
          handleQueryVariableChange({
            postId: postId,
            commentId: commentId,
            queryPropertyName: queryPropertyName,
            first:
              prevResult[queryPropertyName].edges.length +
              fetchMoreResult[queryPropertyName].edges.length,
          });
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

  return { data, loading, loadMoreItems };
};

export default useQueryLikers;
