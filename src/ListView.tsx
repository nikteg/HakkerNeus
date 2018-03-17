import * as React from "react";
import { FlatList, View, Text } from "react-native";
import styled from "styled-components/native";
import { graphql, QueryProps } from "react-apollo";
import gql from "graphql-tag";

const ListItem = styled.Text`
  padding: 10px;
`;

function ListView(props: Response & Props) {
  return (
    <FlatList
      data={props.items}
      keyExtractor={(i) => String(i.id)}
      renderItem={({ item, index, separators }) => (
        <ListItem onPress={() => props.onPress(item.url)}>{item.title}</ListItem>
      )}
    />
  );
}

type Item = {
  id: number;
  title: string;
  url: string;
};

type Response = {
  items: Item[];
};

type Props = {
  onPress: (uri: string) => void;
};

const ListViewConnected = graphql<Response, Props>(
  gql`
    query ListViewQuery {
      items {
        id
        title
        url
      }
    }
  `,
  { props: ({ data }) => ({ ...data }) },
)(ListView);

export default ListViewConnected;
