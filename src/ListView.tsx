import * as React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { graphql, QueryProps, ChildProps } from "react-apollo";
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

const ListView: React.SFC<Props & ChildProps<Props, Response>> = (props) => {
  if (props.data.error) {
    return <Text>{props.data.error.message}</Text>;
  }

  return (
    <FlatList
      data={props.data.items}
      refreshing={props.data.loading}
      onRefresh={props.data.refetch}
      keyExtractor={(i) => String(i.id)}
      renderItem={({ item }) => (
        <ListItem>
          <ItemContainer onPress={() => props.onPress(item)}>
            <Header>
              <Text style={{ fontSize: 10, color: "#ff6600" }}>{item.score}</Text>
              <Text style={{ fontSize: 10, color: "#666666" }}> · {moment(item.time * 1000).fromNow()}</Text>
            </Header>
            <Title>
              <Text>{item.title}</Text>
            </Title>
            <Text style={{ fontSize: 10, color: "#666666" }}>
              {item.by.id}
              {item.url && " — " + item.url}
            </Text>
          </ItemContainer>
          <Comment onPress={() => props.onPressComment(item)}>
            <Icon name="comments" size={24} color={"#ff6600"} />
            <Text style={{ fontSize: 10 }}>{item.descendants}</Text>
          </Comment>
        </ListItem>
      )}
    />
  );
};

type Response = {
  items: StoryItem[];
};

type Props = {
  onPress: (item: Item) => void;
  onPressComment: (item: Item) => void;
};

const ListViewConnected = graphql<Props>(
  gql`
    query ListViewQuery {
      items {
        ... on Story {
          id
          score
          time
          by {
            id
          }
          title
          url
          descendants
        }
      }
    }
  `,
)(ListView);

export default ListViewConnected;
