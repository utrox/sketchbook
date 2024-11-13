interface CommentType {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    avatar: string;
  };
}

export default CommentType;
