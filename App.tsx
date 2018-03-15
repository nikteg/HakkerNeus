import * as React from "react";
import { Platform, StyleSheet, Text, View, WebView } from "react-native";
import ListView from "./src/ListView";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { StackNavigator, NavigationScreenProps } from "react-navigation";

// @ts-ignore
import * as packageJson from "./package.json";

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({ uri: "http://localhost:3000/graphql" }),
  cache: new InMemoryCache(),
});

class HomeScreen extends React.Component<NavigationScreenProps> {
  static navigationOptions = {
    title: `${packageJson.name} v${packageJson.version}`,
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <ListView onPress={(uri: string) => this.props.navigation.navigate("Reader", { uri })} />
      </ApolloProvider>
    );
  }
}

type ReaderScreenProps = {
  uri: string;
};

type ReaderScreenState = {
  html: string;
};

interface ReadableResponse {
  title: string;
  author: string;
  date_published?: any;
  dek?: any;
  lead_image_url: string;
  content: string;
  next_page_url?: any;
  url: string;
  domain: string;
  excerpt: string;
  word_count: number;
  direction: string;
  total_pages: number;
  rendered_pages: number;
}

class ReaderScreen extends React.Component<ReaderScreenProps & NavigationScreenProps, ReaderScreenState> {
  state: ReaderScreenState = {
    html: "Loading...",
  };

  componentWillMount() {
    const { uri } = this.props.navigation.state.params;
    const readableUri = `http://localhost:3000/readability/?url=${encodeURIComponent(uri)}`;

    fetch(readableUri)
      .then((res) => res.json())
      .then((res: ReadableResponse) => this.setState({ html: res.content }));
  }

  render() {
    const { html } = this.state;
    return <WebView source={{ html }} />;
  }
}

export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Reader: {
    screen: ReaderScreen,
  },
});
