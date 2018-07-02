import * as React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { graphql, QueryProps, ChildProps } from "react-apollo";
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

const ListView: React.SFC<Props & DataProps> = (props) => {
  if (props.data.error) {
    return <Text>{props.data.error.message}</Text>;
  }

  return (
    <FlatList
      data={props.data.items}
      refreshing={props.data.loading}
      onRefresh={props.data.refetch}
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
};

type DataProps = ChildProps<Props, Response>;

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
)(ListView);

export default ListViewConnected;
