import * as React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { graphql, QueryProps } from "react-apollo";
import gql from "graphql-tag";
import { Item } from "../backend/src/typings/api";

const ListItem = styled.View`
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  border-bottom-width: ${StyleSheet.hairlineWidth};
`;

const Title = styled.TouchableOpacity`
  padding: 10px;
  flex: 1;
`;
const Comment = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 30px;
  background-color: #bbb;
`;

function ListView(props: Response & Props) {
  if (props.error) {
    return <Text>{props.error.message}</Text>;
  }

  return (
    <FlatList
      data={props.items}
      refreshing={props.loading}
      onRefresh={props.refetch}
      keyExtractor={(i) => String(i.id)}
      renderItem={({ item, index, separators }) => (
        <ListItem>
          <Title onPress={() => props.onPress(item)}>
            <Text>{item.title}</Text>
          </Title>
          <Comment onPress={() => props.onPressComment(item)}>
            <Text>{item.descendants}</Text>
          </Comment>
        </ListItem>
      )}
    />
  );
}

type Response = {
  items: Item[];
};

type Props = {
  onPress: (item: Item) => void;
  onPressComment: (item: Item) => void;
};

const ListViewConnected = graphql<Response, Props>(
  gql`
    query ListViewQuery {
      items {
        ... on Story {
          id
          title
          url
          descendants
        }
      }
    }
  `,
  { props: ({ data }) => ({ ...data }) },
)(ListView);

export default ListViewConnected;
