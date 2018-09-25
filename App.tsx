import * as React from "react";
import { useScreens } from "react-native-screens";
import { createStackNavigator } from "react-navigation";

import CommentsScreen from "./src/screens/CommentScreen";
import ReaderScreen from "./src/screens/ReaderScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { ApolloProvider } from "react-apollo";
import { client } from "./src/lib/apollo";

useScreens();


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
