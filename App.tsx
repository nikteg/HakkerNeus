import * as React from "react";

import ListView from "./src/ListView";
import { StackNavigator } from "react-navigation";

import CommentsScreen from "./src/screens/CommentScreen";
import ReaderScreen from "./src/screens/ReaderScreen";
import HomeScreen from "./src/screens/HomeScreen";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({ uri: "http://localhost:3000/graphql" }),
  cache: new InMemoryCache(),
});

const Navigator = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Reader: {
    screen: ReaderScreen,
  },
  Comments: {
    screen: CommentsScreen,
  },
});

export default () => (
  <ApolloProvider client={client}>
    <Navigator />
  </ApolloProvider>
);
