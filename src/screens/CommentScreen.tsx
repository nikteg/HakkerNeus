import gql from "graphql-tag";
import moment from "moment";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HTML from "react-native-render-html";
import Icon from "react-native-vector-icons/EvilIcons";
import { NavigationScreenProps } from "react-navigation";

import { ProofsBar } from "../components/Proofs";
import {
  CommentsQuery,
  CommentsQuery_item,
  CommentsQuery_item_Story,
  CommentsQuery_item_Story_kids,
} from "./_generated/CommentsQuery";

type Props = {
  handleInternalLink: (url: string) => any;
};

type ScreenProps = {
  storyId: number;
};

const COLORS = ["transparent", "#F44336", "#2196F3", "#8BC34A", "#FF5722", "#CDDC39"];

const COMMENT_SCREEN_QUERY = gql`
  query CommentsQuery($storyId: Int!) {
    item(id: $storyId) {
      ... on Story {
        kids {
          ...CommentFields
        }
        id
        title
        type
      }
      ... on JobStory {
        id
        title
        type
      }
      ... on Comment {
        kids {
          ...CommentFields
        }
        id
        type
      }
    }
  }

  fragment CommentFields on Comment {
    id
    text
    time
    by {
      id
      proofs {
        key
        url
      }
    }
  }
`;

function isStory(story: CommentsQuery_item): story is CommentsQuery_item_Story {
  return story.type === "story";
}

export default class CommentsScreen extends React.Component<Props & NavigationScreenProps<ScreenProps>> {
  static navigationOptions = {
    title: "Comments",
    headerRight: (
      <TouchableOpacity>
        <Icon name="share-apple" color="#007AFF" size={40} />
      </TouchableOpacity>
    ),
  };

  renderQuery = ({ data, error }: QueryResult<CommentsQuery, ScreenProps>) => {
    if (data && data.item) {
      if (isStory(data.item)) {
        return <ScrollView style={{ backgroundColor: "#eee" }}>{this.renderKids(data.item.kids)}</ScrollView>;
      }
    }

    if (error) {
      return <Text>{JSON.stringify(error)}</Text>;
    }

    return <ActivityIndicator animating hidesWhenStopped />;
  };

  renderKids = (kids: CommentsQuery_item_Story_kids[], depth = 0) => {
    if (!kids) {
      return null;
    }

    return kids.filter((comment) => comment.text).map((comment) => {
      return (
        <React.Fragment key={comment.id}>
          <View
            style={{
              marginLeft: Math.max(0, depth - 1) * 5,
              borderLeftWidth: 5,
              borderLeftColor: COLORS[depth] || "transparent",
              borderBottomColor: "#ddd",
              borderBottomWidth: StyleSheet.hairlineWidth,
              backgroundColor: "#f2f2f2",
              padding: 10,
            }}
          >
            <Text
              style={{
                color: "#ff6600",
                paddingBottom: 10,
              }}
            >
              {comment.by!.id} <ProofsBar proofs={comment.by!.proofs} color="#666666" />
              <Text
                style={{
                  color: "#666666",
                }}
              >
                {" "}
                · {moment(comment.time * 1000).fromNow()}
              </Text>
            </Text>
            <HTML html={comment.text} onLinkPress={this.handlePressLink} />
          </View>
        </React.Fragment>
      );
    });
  };

  handlePressLink = (evt: any, href: string) => {
    if (/^https?:\/\/news.ycombinator.com/.test(href)) {
      this.props.handleInternalLink(href);
    } else {
      Linking.openURL(href);
    }
  };

  render() {
    const { storyId } = this.props.navigation.state.params!;
    return (
      <Query query={COMMENT_SCREEN_QUERY} variables={{ storyId }}>
        {this.renderQuery}
      </Query>
    );
  }
}
