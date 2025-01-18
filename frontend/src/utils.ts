import { toast } from "react-toastify";

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

// Read the CSRF Token from the cookie.
export const getCSRFToken = (): string => {
  const name = "csrftoken";
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }

  return "";
};

// For normal (non-Apollo) fetch requests, we can use this function
export const fetchWithHandling = async (
  url: string,
  options: RequestInit,
  successMessage: string,
  onSuccess?: () => void
) => {
  try {
    const response = await fetch(url, {
      credentials: "include", // Always include cookies
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
        ...options.headers,
      },
      ...options,
    });

    if (response.ok) {
      toast.success(successMessage);
      onSuccess?.();
    } else {
      if (!response.headers.get("content-type")?.includes("application/json")) {
        toast.error("An error occurred.");
        console.error("Error response: ", response);
        return;
      }

      const data = await response.json();
      toast.error(data.errors?.[0].message || "An error occurred.");
      console.error("Error response: ", data);
    }
  } catch (err) {
    console.error("Fetch error: ", err);
    toast.error(
      "An error occurred while processing your request. Server might be down."
    );
  }
};
