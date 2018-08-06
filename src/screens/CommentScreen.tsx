import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { graphql, QueryProps, ChildProps } from "react-apollo";
import gql from "graphql-tag";
import { Item } from "../../backend/src/typings/api";
import { Text, View, ScrollView, Linking, StyleSheet } from "react-native";
import HTML from "react-native-render-html";

type Response = {
  item: any;
};

type Props = { item: Item } & NavigationScreenProps & QueryProps;

const COLORS = ["transparent", "#F44336", "#2196F3", "#8BC34A", "#FF5722", "#CDDC39"];

class CommentsScreen extends React.Component<Props & ChildProps<Props, Response>> {
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
    const { loading } = this.props.data;

    if (!loading) {
      const {
        item: { kids },
      } = this.props.data;
      return <ScrollView style={{ backgroundColor: "#eee" }}>{this.renderKids(kids)}</ScrollView>;
    } else {
      return <Text>loading</Text>;
    }
  }
}

const CommentsScreenConnected = graphql<Props, {}, {}, any>(
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
    options: (props) => {
      return {
        variables: { storyId: props.navigation.state.params.storyId },
      };
    },
  },
)(CommentsScreen);

export default CommentsScreenConnected;
