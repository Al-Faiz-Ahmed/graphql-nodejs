// src/apollo-client.js
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

// 1. Error Handling Link (Production best practice)
const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) =>
      console.log(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      )
    );
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

// 2. HTTP Link to your Express Server
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql", // Your Express endpoint
});

// 3. Initialize Apollo Client
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]), // Combine links
  cache: new InMemoryCache(), // This enables the powerful caching
});

export default client;
