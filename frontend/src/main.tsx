import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  from,
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

import { onError } from "@apollo/client/link/error";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import "./css/index.css";

// Read the CSRF Token from the cookie. 
const getCSRFToken = (): string => {
  const name = "csrftoken";
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return "";
};

// Error-handler, when the grapQL API returns an error,
// we're going to display the user-friendly message to the user
// in a toast and log the details to the console.
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}`);
      console.error(`Path: ${path}`);
      console.error(`Location: ${locations}`);
      toast.error(`[GraphQL error]: Message: ${message}`);
    });

  if (networkError) toast.error(`[Network error]: ${networkError}`);
});

const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_BACKEND_GRAPHQL_URL,
  headers: {
    "X-CSRFToken": getCSRFToken(),
  }
});

const link = from([errorLink, uploadLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
