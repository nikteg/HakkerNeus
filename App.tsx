import * as React from "react";
import { useScreens } from "react-native-screens";

import ListView from "./src/ListView";
import { StackNavigator, createStackNavigator } from "react-navigation";

import CommentsScreen from "./src/screens/CommentScreen";
import ReaderScreen from "./src/screens/ReaderScreen";
import HomeScreen from "./src/screens/HomeScreen";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { onError } from "apollo-link-error";

const introspectionQueryResultData = require("./fragmentTypes.json");

useScreens();

const logoutLink = onError(({ networkError, response }) => {
  console.log(response, networkError);
});

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: logoutLink.concat(new HttpLink({ uri: "http://localhost:3000/graphql" })),
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
  }),
});

const Navigator = createStackNavigator({
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
