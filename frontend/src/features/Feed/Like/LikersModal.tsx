import "./likes.css";
import { Link } from "react-router-dom";
import {
  Avatar,
  Divider,
  List,
  ListItemAvatar,
  DialogTitle,
  ListItem,
  ListItemButton,
} from "@mui/material";

interface LikersModalProps {
  postId?: string;
  commentId?: string;
}

const LikersModal = ({ postId, commentId }: LikersModalProps) => {
  /* TODO: integration: 
  fetch list of likers of post/comment w/ pagination */
  console.log(postId);
  console.log(commentId);
  const dummyLikers = [
    {
      username: "dummy1",
      avatar: "https://picsum.photos/211/200/200",
    },
    {
      username: "dummy2",
      avatar: "https://picsum.photos/444/200/200",
    },
    {
      username: "dummy3",
      avatar: "https://picsum.photos/241/200/200",
    },
  ];
  return (
    <div className="likers-modal">
      <DialogTitle>Likers:</DialogTitle>
      <Divider />
      <List>
        {new Array(20)
          .fill(dummyLikers)
          .flat()
          .map((liker: { username: string; avatar: string }) => (
            <ListItem key={liker.username} className="liker">
              <Link to={`/profile/${liker.username}`}>
                <ListItemButton onClick={() => {}}>
                  <ListItemAvatar>
                    <Avatar src={liker.avatar} alt={liker.username} />
                  </ListItemAvatar>
                  <p className="username">{liker.username}</p>
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default LikersModal;
