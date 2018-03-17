import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { ScrollView, Dimensions } from "react-native";
import HTML from "react-native-render-html";

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

const padding = 24;

export default class ReaderScreen extends React.Component<Props & NavigationScreenProps, State> {
  state: State = {
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
    return (
      <ScrollView style={{ flex: 1 }}>
        <HTML
          html={html}
          imagesMaxWidth={Dimensions.get("window").width - padding * 2}
          containerStyle={{ padding: padding }}
        />
      </ScrollView>
    );
  }
}
