import * as React from "react";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { NavigationScreenProps } from "react-navigation";

// @ts-ignore
import * as packageJson from "../../package.json";

import ListView, { Item } from "../ListView";

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({ uri: "http://localhost:3000/graphql" }),
  cache: new InMemoryCache(),
});

export default class HomeScreen extends React.Component<NavigationScreenProps> {
  static navigationOptions = {
    title: `${packageJson.name} v${packageJson.version}`,
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <ListView onPress={(item: Item) => this.props.navigation.navigate("Reader", { item })} />
      </ApolloProvider>
    );
  }
}
