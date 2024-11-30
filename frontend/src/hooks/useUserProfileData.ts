import { useQuery } from "@apollo/client";
import { GET_USER_DATA } from "../api/graphQL/queries/user";

const useQueryUserProfileData = (username: string) => {
  const { data, loading, refetch } = useQuery(GET_USER_DATA, {
    variables: { username },
    notifyOnNetworkStatusChange: true,
  });

  return { data, loading, refetch };
};

export default useQueryUserProfileData;
