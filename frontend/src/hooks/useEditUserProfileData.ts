import { useMutation } from "@apollo/client";
import { EDIT_USER_PROFILE } from "../api/graphQL/mutations/user";

interface EditUserProfileData {
  username?: string;
  password?: string;
  avatar?: File;
  background?: File;
}

const useEditUserProfileData = () => {
  const [editUserProfile, { data, loading, error }] = useMutation(
    EDIT_USER_PROFILE,
    {
      refetchQueries: ["GetUserProfile"],
    }
  );

  const editProfile = async (values: EditUserProfileData) => {
    await editUserProfile({ variables: values });
  };

  return { editProfile, data, loading, error };
};

export default useEditUserProfileData;
