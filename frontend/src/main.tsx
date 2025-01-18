import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  from,
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

import { onError } from "@apollo/client/link/error";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/index.css";
import "bootstrap/dist/css/bootstrap.css";

import App from "./App.tsx";
import { getCSRFToken } from "./utils";


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
  fetchOptions: {
    // Ensure cookies are sent for CSRF protection
    credentials: "include",
  },
});

// Adds the CSRF token to the headers and makes
// sure that the cookies are sent with every request.
const addCsrfTokenLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      ...operation.getContext().headers, // Preserving existing headers
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
  });

  // Forward the request to the next link in the chain
  return forward(operation);
});

const link = from([errorLink, addCsrfTokenLink, uploadLink]);

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
