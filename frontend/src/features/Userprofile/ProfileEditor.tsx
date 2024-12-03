import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImageListType } from "react-images-uploading";
import {
  Container,
  Input,
  Button,
  InputLabel,
  FormHelperText,
  FormControl,
} from "@mui/material";

import ImageUploader from "../ImageUpload/ImageUploader";
import ConfirmationDialog from "../../components/ConfirmationDialog";

import useQueryUserProfileData from "../../hooks/useQueryUserProfileData";
import useEditUserProfileData from "../../hooks/useEditUserProfileData";
import { toast } from "react-toastify";

interface ProfileEditorProps {
  closeModal: () => void;
}

/* TODO: possibly refactor, it's kinda messy. */
const ProfileEditor = ({ closeModal }: ProfileEditorProps) => {
  const { username } = useParams();
  if (!username) {
    throw new Error("No username provided in URL.");
  }

  const navigate = useNavigate();
  const { editProfile, error: editError } = useEditUserProfileData();
  const { data } = useQueryUserProfileData(username);

  const [quitDialogOpen, setQuitDialogOpen] = useState(false);

  // User inputs
  const [userNameInput, setUserNameInput] = useState(data.userProfile.username);
  const [avatarInput, setAvatarInput] = useState<ImageListType>([]);
  const [backgroundInput, setBackgroundInput] = useState<ImageListType>([]);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordConfirmationInput, setPasswordConfirmationInput] =
    useState("");

  const usernameWrongLength =
    userNameInput.length < 3 || userNameInput.length > 20;
  const usernameWrongChars = userNameInput.match(/[^A-Za-z0-9]/g);
  const passwordTooShort = passwordInput.length < 8 && passwordInput.length > 0;
  const passwordsDontMatch = passwordInput !== passwordConfirmationInput;

  const handleCloseAttempt = () => {
    setQuitDialogOpen(true);
  };

  const saveProfile = async () => {
    if (
      usernameWrongLength ||
      usernameWrongChars ||
      passwordTooShort ||
      passwordsDontMatch
    ) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }
    await editProfile({
      username: userNameInput,
      password: passwordInput,
      avatar: avatarInput[0]?.file,
      background: backgroundInput[0]?.file,
    });

    if (!editError) {
      navigate(`/profile/${userNameInput}`);
      closeModal();
    }
  };

  return (
    <Container className="content modal-content profile-editor" maxWidth="sm">
      <h1>Edit your profile:</h1>
      <FormControl>
        <InputLabel htmlFor="username">Username</InputLabel>
        <Input
          id="username"
          type="text"
          placeholder="Username"
          value={userNameInput}
          onChange={(e) => setUserNameInput(e.target.value)}
        />
        <FormHelperText className="wrong-input-helper">
          {usernameWrongLength &&
            "Username must be between 3 and 20 characters."}
          {usernameWrongChars &&
            "Username must only contain letters between A-Z and numbers."}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="password">Change password</InputLabel>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <FormHelperText className="wrong-input-helper">
          {passwordTooShort && "Password must be at least 8 characters."}
        </FormHelperText>
        <FormHelperText>
          Leave empty if you don't want to change your password.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="password-confirmation">
          Confirm password
        </InputLabel>
        <Input
          id="password-confirmation"
          type="password"
          placeholder="Confirm password"
          value={passwordConfirmationInput}
          onChange={(e) => setPasswordConfirmationInput(e.target.value)}
        />
        <FormHelperText className="wrong-input-helper">
          {passwordInput !== passwordConfirmationInput &&
            "Passwords do not match."}
        </FormHelperText>
      </FormControl>
      <ImageUploader
        label="Avatar"
        images={avatarInput}
        setImages={setAvatarInput}
        placeholderImage={{
          data_url: `${import.meta.env.VITE_BACKEND_URL}/${
            data.userProfile.avatar
          }`,
        }}
        key={`avatar-${data.userProfile.username}`}
      />
      <ImageUploader
        label="Profile background"
        images={backgroundInput}
        setImages={setBackgroundInput}
        placeholderImage={{
          data_url: `${import.meta.env.VITE_BACKEND_URL}/${
            data.userProfile.background
          }`,
        }}
        key={`background-${data.userProfile.username}`}
      />
      <Button onClick={saveProfile} color="primary">
        Save
      </Button>
      <Button onClick={handleCloseAttempt} color="error">
        Cancel
      </Button>
      <ConfirmationDialog
        open={quitDialogOpen}
        title={`Leave profile editor?`}
        message={`Are you sure you want to leave the profile editor without saving? All changes will be lost.`}
        onConfirm={closeModal}
        onCancel={() => setQuitDialogOpen(false)}
      />
    </Container>
  );
};

export default ProfileEditor;
