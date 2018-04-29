import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { graphql, QueryProps } from "react-apollo";
import gql from "graphql-tag";
import { Item } from "../../backend/src/typings/api";
import { Text, View, ScrollView, Linking, StyleSheet } from "react-native";
import HTML from "react-native-render-html";

type Props = { item: Item } & NavigationScreenProps;

const COLORS = ["transparent", "#F44336", "#2196F3", "#8BC34A", "#FF5722", "#CDDC39"];

class CommentsScreen extends React.Component<Props> {
  renderKids = (kids, depth = 0) => {
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
            <Text style={{ fontWeight: "800", fontSize: 10, color: "#999" }}>{comment.by.id}</Text>
            <HTML html={comment.text} onLinkPress={(evt, href) => Linking.openURL(href)} />
          </View>
          {this.renderKids(comment.kids, depth + 1)}
        </React.Fragment>
      );
    });
  };
  render() {
    const { loading } = this.props;

    if (!loading) {
      const { item: { kids } } = this.props;
      return <ScrollView style={{ backgroundColor: "#eee" }}>{this.renderKids(kids)}</ScrollView>;
    } else {
      return "loading";
    }
  }
}

const CommentsScreenConnected = graphql<Response, Props>(
  gql`
    query CommmentsQuery($storyId: Int!) {
      item(id: $storyId) {
        ... on Story {
          kids {
            ...CommentsFields
            kids {
              ...CommentsFields
              kids {
                ...CommentsFields
                kids {
                  ...CommentsFields
                }
              }
            }
          }
        }
      }
    }

    fragment CommentsFields on Comment {
      text
      id
      by {
        id
      }
    }
  `,
  {
    props: ({ data }) => ({ ...data }),
    options: (props) => {
      return {
        variables: { storyId: props.navigation.state.params.storyId },
      };
    },
  },
)(CommentsScreen);

export default CommentsScreenConnected;
