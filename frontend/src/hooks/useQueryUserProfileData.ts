import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_DATA } from "../api/graphQL/queries/user";

const useQueryUserProfileData = (username: string) => {
  // See Issue #75 for explanation of this useEffect
  useEffect(() => {
    refetch();
  }, [username]);

  const { data, loading, refetch } = useQuery(GET_USER_DATA, {
    variables: { username },
    notifyOnNetworkStatusChange: true,
  });

  return { data, loading, refetch };
};

export default useQueryUserProfileData;
