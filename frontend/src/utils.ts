export const graphqlIdToNumericId = (idString: string) => {
  /*
  The GraphQL graphene relay Node overrides the id field
  of the object and returns a base64 encoded string
  representing the type of the object and the id in form
  of type:id. We need the numeric ID for further operations, 
  so we read it from the base64 encoded string.
 */
  return atob(idString).split(":")[1];
};

export const numericIdToGraphqlId = (type: string, id: number) => {
  return btoa(`${type}:${id}`);
};
