import * as React from "react";
import { Dimensions, ImageBackground, Linking, ScrollView, Text } from "react-native";
import HTML from "react-native-render-html";
import { NavigationScreenProps } from "react-navigation";
import styled from "styled-components/native";

import { ListViewQuery_items } from "../_generated/ListViewQuery";

type Props = {
  uri: string;
};

const padding = 24;

const HeaderText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin: 24px;
  text-align: center;
  margin-bottom: 0;
`;

export default class ReaderScreen extends React.Component<
  Props & NavigationScreenProps<{ item: ListViewQuery_items }>
> {
  render() {
    const { item } = this.props.navigation.state.params!;

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
          onLinkPress={(_: React.TouchEvent, href: string) => Linking.openURL(href)}
        />
      </ScrollView>
    );
  }
}
