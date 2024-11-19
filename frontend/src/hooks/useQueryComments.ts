import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_COMMENTS_FOR_POST } from "../api/graphQL/queries/comment.ts";

const LOAD_AT_ONCE_COUNT = 5;
const REFETCH_INTERVAL = 15_000;

interface QueryVariables {
  first?: number;
  after?: string;
  postId: number;
}

/* See comment in useQueryFeed.ts as why this solution was used. */
const useQueryComments = (postId: number) => {
  const [variables, setVariables] = useState<QueryVariables>({
    first: LOAD_AT_ONCE_COUNT,
    postId: postId,
  });

  const handleQueryVariableChange = (newVariables: QueryVariables) => {
    setVariables(newVariables);
    stopPolling();
    startPolling(REFETCH_INTERVAL);
  };

  const { data, loading, fetchMore, refetch, startPolling, stopPolling } =
    useQuery(GET_COMMENTS_FOR_POST, {
      variables: variables,
      // Allows for loading state changes on fetchMore
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        startPolling(REFETCH_INTERVAL);
      },
    });

  /* Fetch more items, after the last loaded item. */
  const loadMoreItems = () => {
    if (data.allCommentsForPost.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.allCommentsForPost.pageInfo.endCursor,
          postId: postId,
          first: LOAD_AT_ONCE_COUNT,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          // Update how many items to refetch with polling.
          handleQueryVariableChange({
            postId: postId,
            first:
              prevResult.allCommentsForPost.edges.length +
              fetchMoreResult.allCommentsForPost.edges.length,
          });
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

  return { data, loading, refetch, loadMoreItems };
};

export default useQueryComments;
