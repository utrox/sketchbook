import "./posteditors.css";

import React from "react";
import { Link } from "react-router-dom";
import { Avatar, TextField } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

interface FakePostEditorProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const FakePostEditor = ({ onClick }: FakePostEditorProps) => {
  const { user } = useAuth();

  return (
    <div className="create-post">
      <Link to={`/profile/${user.username}`}>
        <Avatar
          alt={`${user.username}`}
          src={`${import.meta.env.VITE_BACKEND_URL}/${user.avatar}`}
        />
      </Link>
      <TextField
        fullWidth
        label="Post content"
        id="fullWidth"
        value="Post something..."
        onClick={onClick}
      />
    </div>
  );
};

export default FakePostEditor;
