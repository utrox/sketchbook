import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  from,
  HttpLink,
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import "./css/index.css";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      toast.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) toast.error(`[Network error]: ${networkError}`);
});

const link = from([
  errorLink,
  // TODO: read URL from env variable
  new HttpLink({ uri: "http://localhost:8000/graphql/" }),
]);

const client = new ApolloClient({
  link: link,
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
