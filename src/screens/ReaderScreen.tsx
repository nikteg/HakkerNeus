import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { ScrollView, Text, View, Dimensions, Linking, Platform } from "react-native";
import HTMLRenderer from "../common/HTMLRenderer";
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

const tagsStyles = {
  code: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
};

const renderers = {
  pre: (htmlAttibs, children, convertedCSSStyles, passProps) => {
    console.log(htmlAttibs, children, convertedCSSStyles, passProps);

    return children;
  },
};

function errorHTML(error: string, item: Item) {
  return `
    <div>Error: ${error}</div>
    <div>Go to <a href="${item.url}">link</a></div>
  `;
}

export default class ReaderScreen extends React.Component<Props & NavigationScreenProps, State> {
  state: State = {
    html: "<div>Loading...</div>",
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
        <HTMLRenderer html={html} style={{ padding }} />
      </ScrollView>
    );
  }
}
