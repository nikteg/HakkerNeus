import * as React from "react";
import { ActivityIndicator, Dimensions, ImageBackground, Linking, ScrollView, Text } from "react-native";
import HTML from "react-native-render-html";
import { NavigationScreenProps } from "react-navigation";
import styled from "styled-components/native";
import { Query, QueryResult } from "react-apollo";
import gql from "graphql-tag";
import { ReaderQuery, ReaderQuery_item, ReaderQuery_item_Story } from "./_generated/ReaderQuery";
import { client } from "../lib/apollo";

type Props = {
  storyId: number;
};

const padding = 24;

const HeaderText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin: 24px;
  text-align: center;
  margin-bottom: 0;
`;

const READER_SCREEN_QUERY = gql`
  query ReaderQuery($storyId: Int!) {
    item(id: $storyId) {
      id
      url
      type
      title

      ... on Story {
        content {
          lead_image_url
          content
        }
      }
    }
  }
`;

function isStory(story: ReaderQuery_item): story is ReaderQuery_item_Story {
  return story.type === "story";
}

export default class ReaderScreen extends React.Component<NavigationScreenProps<Props>> {
  renderQuery = ({ data, error }: QueryResult<ReaderQuery, Props>) => {
    if (data && data.item) {
      if (isStory(data.item) && data.item.content) {
        const {
          title,
          content: { content, lead_image_url },
        } = data.item;

        const windowSize = Dimensions.get("window");
        return (
          <ScrollView style={{ flex: 1 }}>
            {lead_image_url ? (
              <ImageBackground
                blurRadius={5}
                source={{ uri: lead_image_url }}
                resizeMode="cover"
                style={{ width: "100%", height: windowSize.height / 4 }}
              >
                <HeaderText
                  style={{
                    color: "#f1f1f1",
                    textShadowColor: "#222",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 1,
                  }}
                >
                  {title}
                </HeaderText>
              </ImageBackground>
            ) : (
              <HeaderText>{title}</HeaderText>
            )}
            <HTML
              html={content}
              imagesMaxWidth={windowSize.width - padding * 2}
              containerStyle={{ padding }}
              onLinkPress={(_: React.TouchEvent, href: string) => Linking.openURL(href)}
            />
          </ScrollView>
        );
      }
    }

    if (error) {
      return <Text>{JSON.stringify(error)}</Text>;
    }

    return <ActivityIndicator animating hidesWhenStopped />;
  };

  render() {
    const { storyId } = this.props.navigation.state.params!;
    return (
      <Query query={READER_SCREEN_QUERY} variables={{ storyId }}>
        {this.renderQuery}
      </Query>
    );
  }
}
