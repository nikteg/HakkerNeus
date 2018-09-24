import * as React from "react";
import { NavigationScreenProps, NavigationStackScreenOptions } from "react-navigation";
import { graphql, QueryProps, ChildProps } from "react-apollo";
import gql from "graphql-tag";
import { Item } from "../../backend/src/typings/api";
import { Text, View, ScrollView, Linking, StyleSheet, TouchableOpacityComponent, TouchableOpacity } from "react-native";
import HTML from "react-native-render-html";
import moment from "moment";
import Icon from "react-native-vector-icons/EvilIcons";
import { branch, renderComponent, compose, hoistStatics } from "recompose";
import { ProofsBar } from "../components/Proofs";

type Response = {
  item: any;
};

type Props = {
  item: Item;
  handleInternalLink: (url: string) => any;
} & NavigationScreenProps &
  QueryProps;

const COLORS = ["transparent", "#F44336", "#2196F3", "#8BC34A", "#FF5722", "#CDDC39"];

class CommentsScreen extends React.Component<Props & ChildProps<Props, Response>> {
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
    this.props.navigation.setParams({ title: "Comments for " + this.props.data.item!.title });
  }

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
    const { loading } = this.props.data;

    console.log(this.props.data);

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

const renderWhileLoading = (component, propName = "data") =>
  branch((props) => props[propName] && props[propName].loading, renderComponent(component));

const CommentsScreenConnected = graphql<Props, {}, {}, any>(
  gql`
    query CommentsQuery($storyId: Int!) {
      item(id: $storyId) {
        ... on Story {
          id
          title
          kids {
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
          type
        }
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
);

export default hoistStatics(
  compose(
    CommentsScreenConnected,
    renderWhileLoading(() => <Text>Loading</Text>),
  ),
)(CommentsScreen);
