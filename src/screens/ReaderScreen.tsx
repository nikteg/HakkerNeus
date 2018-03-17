import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { ScrollView, Text, Dimensions, Linking } from "react-native";
import HTML from "react-native-render-html";
import { Item } from "../ListView";

type Props = {
  uri: string;
};

type State = {
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

interface ErrorResponse {
  error: string;
}

const padding = 24;

function errorHTML(error: string, item: Item) {
  return `
    <div>Error: ${error}</div>
    <div>Go to <a href="${item.url}">link</a></div>
  `;
}

export default class ReaderScreen extends React.Component<Props & NavigationScreenProps, State> {
  state: State = {
    html: "Loading...",
  };

  componentWillMount() {
    const { item } = this.props.navigation.state.params;
    const readableUrl = `http://localhost:3000/readability/?url=${encodeURIComponent(item.url)}`;

    fetch(readableUrl)
      .then((res) => (res.status === 200 ? res.json() : Promise.reject(res)))
      .then((res: ReadableResponse) => this.setState({ html: res.content }))
      .catch((res: Response) => res.json())
      .then((res: ErrorResponse) => this.setState({ html: errorHTML(res.error, item) }));
  }

  render() {
    const { item } = this.props.navigation.state.params;
    const { html } = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", margin: 24, marginBottom: 0 }}>{item.title}</Text>
        <HTML
          html={html}
          imagesMaxWidth={Dimensions.get("window").width - padding * 2}
          containerStyle={{ padding: padding }}
          onLinkPress={(evt, href) => Linking.openURL(href)}
        />
      </ScrollView>
    );
  }
}
