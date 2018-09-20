import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { Dimensions, ImageBackground, Linking, ScrollView, Text } from "react-native";
import HTML from "react-native-render-html";
import { Item, StoryItem } from "../../backend/src/typings/api";
import styled from "styled-components/native";

type Props = {
  uri: string;
};

interface ErrorResponse {
  error: string;
}

const padding = 24;

function errorHTML(error: string, item: Item) {
  if (isStoryItem(item)) {
    return `
    <div>Error: ${error}</div>
    <div>Go to <a href="${item.url}">link</a></div>
  `;
  }
  return `
    <div>Error: ${error}</div>
  `;
}

function isStoryItem(item: Item): item is StoryItem {
  return item.type === "story";
}

const HeaderText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin: 24px;
  text-align: center;
  margin-bottom: 0;
`;

export default class ReaderScreen extends React.Component<Props & NavigationScreenProps> {
  render() {
    const { item } = this.props.navigation.state.params;

    if (!isStoryItem(item)) {
      return <Text>Item is not story item</Text>;
    }
    if (!item.content) {
      return <Text>No content in item</Text>;
    }

    const { lead_image_url: header, content: html } = item.content;

    return (
      <ScrollView style={{ flex: 1 }}>
        {header ? (
          <ImageBackground blurRadius={5} source={{ uri: header }} style={{ width: "100%", height: "25%" }}>
            <HeaderText
              style={{
                color: "#f1f1f1",
                textShadowColor: "#222",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}
            >
              {item.title}
            </HeaderText>
          </ImageBackground>
        ) : (
          <HeaderText>{item.title}</HeaderText>
        )}
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
