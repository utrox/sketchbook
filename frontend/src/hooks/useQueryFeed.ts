import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_FEED_DATA } from "../api/graphQL/queries/feed.ts";

const LOAD_AT_ONCE_COUNT = 10;
const REFETCH_INTERVAL = 15_000;

interface QueryVariables {
  first?: number;
  after?: string;
}

/* 
The problem is, that apollo-client does not support cursor-based pagination and polling together. 
The polling only updates the items that were loaded in the initial query (the first 10 items in our case), 
and not does not poll posts that were added using fetchMore.
Because it's not possible to use a state for example, 
to dinamically change what gets queried, we need to do this Mickey Mouse bs manually.
If we call stopPolling() and startPolling(), it will use the new values from the state
to run the polling. Thus until we load the next page, it will poll for the correct data.
When we load the next page, we override the data that needs to be polled.

See further: 
https://github.com/apollographql/apollo-client/issues/1121
https://github.com/apollographql/apollo-client/issues/1087
https://github.com/apollographql/apollo-client/issues/3053

Also, technically we are not using pagination, but rather "partial
new data loading". We are loading new data in chunks, but we are not 
*/
const useQueryFeed = () => {
  const [variables, setVariables] = useState<QueryVariables>({
    first: LOAD_AT_ONCE_COUNT,
  });

  const handleQueryVariableChange = (newVariables: QueryVariables) => {
    setVariables(newVariables);
    stopPolling();
    startPolling(REFETCH_INTERVAL);
  };

  const { data, loading, refetch, fetchMore, startPolling, stopPolling } =
    useQuery(GET_FEED_DATA, {
      variables: variables,
      // Allows for loading state changes on fetchMore
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        startPolling(REFETCH_INTERVAL);
      },
    });

  /* Fetch more items, after the last loaded item. */
  const loadMoreItems = () => {
    if (data.feed.pageInfo.hasNextPage) {
      // Load 10 more items to the already loaded ones.
      fetchMore({
        variables: {
          after: data.feed.pageInfo.endCursor,
          first: LOAD_AT_ONCE_COUNT,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          // Update how many items to refetch with polling.
          handleQueryVariableChange({
            first:
              prevResult.feed.edges.length + fetchMoreResult.feed.edges.length,
          });
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

  return { data, loading, refetch, loadMoreItems };
};

export default useQueryFeed;
