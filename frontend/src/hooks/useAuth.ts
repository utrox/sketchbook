import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../api/graphQL/queries/auth";

export function useAuth() {
  const { data, loading, error } = useQuery(ME_QUERY);
  return { user: data?.me, loading, error };
}
