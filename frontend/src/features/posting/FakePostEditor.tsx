import "./posteditors.css";

import React from "react";
import { Link } from "react-router-dom";
import { Avatar, TextField } from "@mui/material";

interface FakePostEditorProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const FakePostEditor = ({ onClick }: FakePostEditorProps) => {
  return (
    <div className="create-post">
      <Link to="/profile/TODO:username">
        <Avatar alt="TODO: username" src="/TODO:avatar.jpg" />
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
