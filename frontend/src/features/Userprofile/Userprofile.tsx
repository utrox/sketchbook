import "./userprofile.css";

import { useState } from "react";
import { useParams } from "react-router-dom";
import EditButton from "@mui/icons-material/Edit";
import { Avatar, Tab, Tabs, Button, Modal, Container } from "@mui/material";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import useQueryUserProfileData from "../../hooks/useQueryUserProfileData";

// Components
import Navbar from "../../features/Navbar/Navbar";
import PostHistory from "./PostHistory";
import ProfileEditor from "./ProfileEditor";
import PageTitle from "../../components/PageTitle";

const Userprofile = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const { username } = useParams();

  if (!username) {
    throw new Error("No username provided in URL.");
  }
  const { user: userData, loading: userDataLoading } = useAuth();

  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const { data, loading } = useQueryUserProfileData(username);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <PageTitle title={`@${username}`} />
      <Navbar />
      <Container className="userprofile-content" maxWidth="md">
        {loading || userDataLoading ? (
          <h1>Loading...</h1>
        ) : data?.userProfile ? (
          <div>
            <div
              className="profile-header"
              style={{
                background: `
      linear-gradient(var(--image-gradient), var(--image-gradient)),
      url(${import.meta.env.VITE_BACKEND_URL}/${
                  // Replace backslashes with forward slashes. In img src,
                  // the browser does it for us, but in css, we need to do it manually,
                  // otherwise the link is broken.
                  data?.userProfile.background.replace(/\\/g, "/")
                }) no-repeat center center / cover
    `,
              }}
            ></div>
            <div className="profile-data">
              <Avatar
                className="profile-avatar"
                src={`${import.meta.env.VITE_BACKEND_URL}/${
                  data.userProfile.avatar
                }`}
                alt={username}
                onClick={() => setIsProfileEditorOpen(true)}
              >
                {username}
              </Avatar>
              <div className="userdata">
                <h1>{username}</h1>
                <p>
                  Date joined:{" "}
                  {new Date(data?.userProfile.createdAt).toLocaleDateString()}
                </p>
              </div>
              {userData?.id === data?.userProfile.id ? (
                <>
                  <Button onClick={() => setIsProfileEditorOpen(true)}>
                    <EditButton />
                  </Button>
                  <Modal open={isProfileEditorOpen}>
                    <ProfileEditor
                      closeModal={() => setIsProfileEditorOpen(false)}
                    />
                  </Modal>
                </>
              ) : (
                /* TODO: if timewise we can pull it off, add connection functionality */
                <Button onClick={() => {}}>Connect</Button>
              )}
            </div>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              centered
              indicatorColor="primary"
              textColor="primary"
              sx={{ marginBottom: 3 }}
            >
              <Tab label="Posts" />
              <Tab label="Photos" />
              <Tab label="Connections" />
            </Tabs>
            <Container className="userprofile-content" maxWidth="sm">
              {tabIndex === 0 && <PostHistory />}
              {/* 
              TODO: implement only showing only photos in a grid-like structure, 
              if they click on it, show the original post in a modal 
              */}
              {tabIndex === 1 && <div>PHOTOS</div>}
              {tabIndex === 2 && <div>CONNECTIONS</div>}
            </Container>
          </div>
        ) : (
          /* TODO: better not found component */
          <div>User not found.</div>
        )}
      </Container>
    </>
  );
};
export default Userprofile;
