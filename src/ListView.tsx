import * as React from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import styled from "styled-components/native";
import { ChildProps, graphql } from "react-apollo";
import gql from "graphql-tag";
import { Item, StoryItem } from "../backend/src/typings/api";
import moment from "moment";

import Icon from "react-native-vector-icons/Foundation";
import { ProofsBar } from "./components/Proofs";
import { ListViewQuery, ListViewQuery_items } from "./_generated/ListViewQuery";

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

class ListView extends React.Component<ChildProps<Props, ListViewQuery>, State> {
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
    this.props.data!.fetchMore({
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
    // TODO: Remove !
    console.log("fetch more dispatched! offset:", this.props.data!.items!.length);
    this.setState({ fetchingMore: true });
    this.props.data!.fetchMore({
      variables: {
        offset: this.props.data!.items!.length,
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

  keyExtractor = (item: ListViewQuery_items) => String(item.id);

  renderBottomLoader = () => {
    const { fetchingMore } = this.state;
    return (
      <View style={{ paddingVertical: 30 }}>
        <ActivityIndicator animating={fetchingMore} hidesWhenStopped />
      </View>
    );
  };

  render() {
    const { data } = this.props;

    if (!data) {
      return <Text>Loading...</Text>;
    }

    const { error, loading } = data;

    const { refreshing } = this.state;

    if (error) {
      return (
        <ScrollView>
          <Text>{JSON.stringify(error, null, 2)}</Text>
        </ScrollView>
      );
    }

    if (!data.items) {
      return <Text>Loading...</Text>;
    }

    return (
      <FlatList
        data={data.items}
        ListFooterComponent={this.renderBottomLoader}
        refreshing={loading || refreshing}
        onEndReached={this.endReached}
        onRefresh={this.handlePullToRefresh}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    );
  }

  private renderItem = ({ item, index }: { item: ListViewQuery_items; index: number }) => (
    <ListItem>
      <Number>{index + 1}</Number>
      <ItemContainer onPress={() => this.props.onPress(item)} onLongPress={() => this.props.onLongPress(item)}>
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
          {item.by.id} <ProofsBar proofs={item.by.proofs} color="#666666" />
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

type Props = {
  onPress: (item: ListViewQuery_items) => void;
  onLongPress: (item: ListViewQuery_items) => void;
  onPressComment: (item: ListViewQuery_items) => void;
};

const ListViewConnected = graphql<Props, ListViewQuery>(
  gql`
    query ListViewQuery($offset: Int!) {
      items: topstories(first: 15, offset: $offset) {
        id
        score
        time
        by {
          id
          proofs {
            key
            url
          }
        }
        title
        url
        type
        descendants
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
