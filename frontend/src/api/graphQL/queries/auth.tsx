import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      avatar
    }
  }
`;

export function useAuth() {
  const { data, loading, error } = useQuery(ME_QUERY);
  return { user: data?.me, loading, error };
}
