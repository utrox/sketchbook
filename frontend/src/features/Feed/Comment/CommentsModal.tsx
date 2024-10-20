import { DialogTitle, Divider, List, Container } from "@mui/material";
import Comment, { CommentProps } from "./Comment.tsx";
import CommentEditor from "./CommentEditor.tsx";
import { fakeComments } from "../dummy_data.ts";

const Comments = ({ postId }: { postId: string }) => {
  /* TODO: fetch comments for post with pagination */
  const comments: CommentProps[] = [...fakeComments];
  return (
    <Container maxWidth="sm" className="comments-modal">
      <DialogTitle>Comments</DialogTitle>
      <Divider />
      <List>
        {comments.length === 0 && <p className="no-comments">No comments</p>}
        {comments.map((comment) => (
          <>
            <Comment key={comment.id} {...comment} />
            <Divider variant="middle" />
          </>
        ))}
      </List>
      {/* TODO: comment editor at the bottom, but fixed, so that you dont gotta scroll all the way to the bottom of all comments */}
      <CommentEditor onSubmit={() => {}} />
    </Container>
  );
};

export default Comments;
