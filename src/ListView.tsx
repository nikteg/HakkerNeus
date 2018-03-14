import * as React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";

const LIST = [0, 1, 2, 3, 4, 5];

const ListItem = styled.Text`
  padding: 10px;
  color: red;
`;

export const ListView = () => (
  <FlatList
    data={LIST}
    keyExtractor={(i) => i.toString()}
    renderItem={({ item, index, separators }) => (
      <ListItem key={index}>{item}</ListItem>
    )}
  />
);
