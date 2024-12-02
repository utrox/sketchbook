import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Post from "../Feed/Post";
import FeedPostType from "../../api/graphQL/types/FeedPostType";
import useQueryPostHistory from "../../hooks/useQueryPostHistory";
import InfiniteScroll from "../../components/InfiniteScroll";

const PostHistory = () => {
  const { username } = useParams();
  if (!username) {
    throw new Error("No username provided");
  }

  const [items, setItems] = useState([]);
  const { data, loading, loadMoreItems } = useQueryPostHistory(username);

  useEffect(() => {
    if (data) {
      setItems(
        data.postHistory.edges.map((edge: { node: FeedPostType }) => edge.node)
      );
    }
  }, [data]);

  return (
    <div className="posts history">
      <InfiniteScroll
        items={items}
        loading={loading}
        ItemComponent={Post}
        itemProps={{}}
        hasMore={data?.feed?.pageInfo?.hasNextPage}
        loadMoreItems={loadMoreItems}
        /* TODO better component for showing these messages, and loading  */
        loadingComponent={<div>Loading...</div>}
        hasNoElementComponent={<div>No posts yet...</div>}
        hasNoMoreComponent={<div>No more posts</div>}
      />
    </div>
  );
};

export default PostHistory;
