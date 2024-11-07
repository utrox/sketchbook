interface FeedPostType {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  image: string;
  commentCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export default FeedPostType;
