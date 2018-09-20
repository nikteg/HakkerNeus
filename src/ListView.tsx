import * as React from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import styled from "styled-components/native";
import { ChildProps, graphql } from "react-apollo";
import gql from "graphql-tag";
import { Item, StoryItem } from "../backend/src/typings/api";
import moment from "moment";

import Icon from "react-native-vector-icons/Foundation";

const ListItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.View`
  padding: 4px 0;
`;

const Comment = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 10px;
  /* background-color: #bbb; */
`;

const ItemContainer = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
`;

const Header = styled.View`
  flex-direction: row;
`;

const Number = styled.Text`
  color: #666666;
  align-items: center;
  justify-content: center;
  padding: 32px 0px 10px 10px;
`;

type State = {
  fetchingMore: boolean;
  refreshing: boolean;
};

class ListView extends React.Component<Props & ChildProps<Props, Response>, State> {
  state: State = {
    fetchingMore: false,
    refreshing: false,
  };

  handlePullToRefresh = () => {
    if (this.state.refreshing) {
      console.log("refresh already in progress...");
      return;
    }
    console.log("refreshing dispatched!");
    this.setState({ refreshing: true });
    this.props.data.fetchMore({
      variables: {
        offset: 0,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        this.setState({ refreshing: false });
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          items: fetchMoreResult.items,
        });
      },
    });
  };

  endReached = () => {
    if (this.state.fetchingMore) {
      console.log("fetch more already in progress...");
      return;
    }
    console.log("fetch more dispatched! offset:", this.props.data.items.length);
    this.setState({ fetchingMore: true });
    this.props.data.fetchMore({
      variables: {
        offset: this.props.data.items.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        this.setState({ fetchingMore: false });
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          items: prev.items.concat(fetchMoreResult.items),
        });
      },
    });
  };

  keyExtractor = (item: Item) => String(item.id);

  renderBottomLoader = () => {
    const { fetchingMore } = this.state;
    return (
      <View style={{ paddingVertical: 30 }}>
        <ActivityIndicator animating={fetchingMore} hidesWhenStopped />
      </View>
    );
  };

  render() {
    const {
      data: { error, loading },
    } = this.props;
    const { refreshing } = this.state;
    if (error) {
      return (
        <ScrollView>
          <Text>{JSON.stringify(this.props.data.error, null, 2)}</Text>
        </ScrollView>
      );
    }
    return (
      <FlatList
        data={this.props.data.items}
        ListFooterComponent={this.renderBottomLoader}
        refreshing={loading || refreshing}
        onEndReached={this.endReached}
        onRefresh={this.handlePullToRefresh}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    );
  }

  private renderItem = ({ item, index }) => (
    <ListItem>
      <Number>{index + 1}</Number>
      <ItemContainer onPress={() => this.props.onPress(item)}>
        <Header>
          <Text style={{ color: "#ff6600" }}>
            {item.score}
            <Text style={{ color: "#666666" }}> · {moment(item.time * 1000).fromNow()}</Text>
          </Text>
        </Header>
        <Title>
          <Text style={{ fontSize: 16 }}>{item.title}</Text>
        </Title>
        <Text style={{ color: "#666666" }}>
          {item.by.id}
          {item.url && " — " + item.url}
        </Text>
      </ItemContainer>
      {item.descendants !== undefined && (
        <Comment onPress={() => item.descendants > 0 && this.props.onPressComment(item)}>
          <Icon name="comments" size={24} color={"#ff6600"} />
          <Text>{item.descendants}</Text>
        </Comment>
      )}
    </ListItem>
  );
}

type Response = {
  items: StoryItem[];
};

type Props = {
  onPress: (item: Item) => void;
  onPressComment: (item: Item) => void;
};

const ListViewConnected = graphql<Props>(
  gql`
    query ListViewQuery($offset: Int!) {
      items: topstories(first: 15, offset: $offset) {
        ... on Story {
          id
          score
          time
          by {
            id
          }
          title
          url
          type
          descendants
          content {
            content
            lead_image_url
          }
        }
        ... on JobStory {
          id
          score
          by {
            id
          }
          title
          time
          url
          type
        }
      }
    }
  `,
  {
    options: {
      variables: {
        offset: 0,
      },
    },
  },
)(ListView);

export default ListViewConnected;
