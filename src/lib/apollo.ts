import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";

const introspectionQueryResultData = require("../../fragmentTypes.json");

const logoutLink = onError(({ networkError, response, graphQLErrors, operation }) => {
  console.log("onError", response, networkError, graphQLErrors, operation);
});

export const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  //@ts-ignore
  link: logoutLink.concat(new HttpLink({ uri: "http://localhost:3000/graphql" })),
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
  }),
});
