import { useState } from "react";
import { useQuery, DocumentNode } from "@apollo/client";

interface QueryParameters {
  [key: string]: any;
}

/* 
The problem is, that apollo-client does not support cursor-based pagination 
and polling together. The polling only updates the items that were loaded 
in the initial query (the first 10 items in our case), and not does not poll 
(update) posts/items that were added using fetchMore.

Because it's not possible to use a state for example, 
to dinamically change what gets queried, we need to do this ̶M̶i̶c̶k̶e̶y̶ ̶m̶o̶u̶s̶e̶ ̶b̶s̶
suboptimal workaround manually. If we call stopPolling() and startPolling(), 
it will use the new values from the state to run the polling. 
Thus, until we load the next page, it will poll for the correct data.
When we load the next page, we override the data that needs to be polled.

See further: 
https://github.com/apollographql/apollo-client/issues/1121
https://github.com/apollographql/apollo-client/issues/1087
https://github.com/apollographql/apollo-client/issues/3053

Also, technically we are not using pagination, but rather "partial
new data loading". We are loading new data in chunks, but we are not 
*/
const useQueryWithCursorPagination = (
  graphqlQuery: DocumentNode,
  queryDataPropertyName: string,
  defaultVariables = {},
  loadAtOnceCount = 10,
  refetchInterval = 15_000
) => {
  const [firstLoadedCursor, setFirstLoadedCursor] = useState<string | null>();
  const [variables, setVariables] = useState<QueryParameters>({
    first: loadAtOnceCount,
    ...defaultVariables,
  });

  const handleQueryVariableChange = (newVariables: QueryParameters) => {
    setVariables({
      ...newVariables,
      ...defaultVariables,
    });
    // stopPolling();
    // startPolling(refetchInterval);
  };

  const { data, loading, fetchMore, refetch, startPolling, stopPolling } =
    useQuery(graphqlQuery, {
      variables: variables,
      // Allows for loading state changes on fetchMore
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        startPolling(refetchInterval);
        if (!firstLoadedCursor) {
          // Set the first loaded cursor, if it's not set yet.
          // See issue #55 for more info.
          setFirstLoadedCursor(
            data[queryDataPropertyName].pageInfo.startCursor
          );
        }
      },
    });

  /* Fetch more items, after the last loaded item. */
  const loadMoreItems = () => {
    stopPolling();
    // Use setFirstLoadedCursor to get the latest value.
    setFirstLoadedCursor((currentCursor) => {
      setVariables((prevVariables) => ({
        ...prevVariables,
        first: data[queryDataPropertyName].edges.length + loadAtOnceCount,
        after: currentCursor, // Uses the latest value
      }));
      console.log(
        "data endCursor: ",
        data[queryDataPropertyName]?.pageInfo?.endCursor
      );

      // Return the cursor to keep state consistent
      return currentCursor;
    });
    startPolling(refetchInterval);
  };

  return {
    data,
    loading,
    refetch,
    loadMoreItems,
  };
};

export default useQueryWithCursorPagination;
