import gql from "graphql-tag";
import moment from "moment";
import * as React from "react";
import { ChildProps, graphql, QueryProps } from "react-apollo";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HTML from "react-native-render-html";
import Icon from "react-native-vector-icons/EvilIcons";
import { NavigationScreenProps, NavigationStackScreenOptions } from "react-navigation";
import { branch, compose, hoistStatics, renderComponent } from "recompose";

import { ListViewQuery_items } from "../_generated/ListViewQuery";
import { ProofsBar } from "../components/Proofs";
import {
  CommentsQuery,
  CommentsQuery_item_Story_kids,
  CommentsQuery_item,
  CommentsQuery_item_Story,
} from "./_generated/CommentsQuery";

type Props = {
  item?: ListViewQuery_items;
  handleInternalLink: (url: string) => any;
} & NavigationScreenProps &
  QueryProps;

const COLORS = ["transparent", "#F44336", "#2196F3", "#8BC34A", "#FF5722", "#CDDC39"];

class CommentsScreen extends React.Component<ChildProps<Props, CommentsQuery>> {
  static navigationOptions = ({
    navigation,
  }: NavigationScreenProps<{ title: string }>): NavigationStackScreenOptions => {
    return {
      title: navigation.getParam("title", "Comments"),
      headerRight: (
        <TouchableOpacity>
          <Icon name="share-apple" color="#007AFF" size={40} />
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    // TODO: Fix this
    // this.props.navigation.setParams({ title: "Comments for " + this.props.item.title });
  }

  renderKids = (kids: CommentsQuery_item_Story_kids[], depth = 0) => {
    if (!kids) {
      return null;
    }

    return kids.filter((comment) => comment.text).map((comment: any) => {
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
              {comment.by.id} <ProofsBar proofs={comment.by.proofs} color="#666666" />
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
          {this.renderKids(comment.kids, depth + 1)}
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
    const { data } = this.props;

    if (!data || !data.item) {
      return <Text>Loading...</Text>;
    }

    // const { error, loading } = data;

    if (data.item && isStoryWithKids(data.item)) {
      return <ScrollView style={{ backgroundColor: "#eee" }}>{this.renderKids(data.item.kids)}</ScrollView>;
    } else {
      return <Text>loading</Text>;
    }
  }
}

function isStoryWithKids(story: CommentsQuery_item): story is CommentsQuery_item_Story {
  return story.type === "story";
}

// TODO: Fix generics and shit
const renderWhileLoading = (component: React.ComponentType<any>, propName: string = "data") =>
  branch<any>((props) => props[propName] && props[propName].loading, renderComponent(component));

const CommentsScreenConnected = graphql<Props, {}, {}, any>(
  gql`
    query CommentsQuery($storyId: Int!) {
      item(id: $storyId) {
        ... on Story {
          id
          title
          kids {
            ...CommentFragment
          }
          type
        }
        ... on JobStory {
          id
          title
          type
        }
        ... on Comment {
          id
          kids {
            ...CommentFragment
          }
          type
        }
      }
    }

    fragment CommentFragment on Comment {
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
  `,
  {
    options: (props) => {
      return {
        variables: { storyId: props.navigation.state.params!.storyId },
      };
    },
  },
);

const LoadingText: any = () => <Text>Loading</Text>;

export default hoistStatics(
  compose<any, any>(
    CommentsScreenConnected,
    renderWhileLoading(LoadingText),
  ),
)(CommentsScreen);
