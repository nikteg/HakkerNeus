import * as React from "react";
import Icon from "react-native-vector-icons/Foundation";
import { sortBy } from "lodash";
import { Text } from "react-native";

type Props = {
  proofs: any;
  color: string;
};

export const ProofsBar = ({ proofs, color }: Props) => {
  if (!proofs) {
    return null;
  }

  const proofsToShow = sortBy(proofs.filter((p) => p.key !== "hackernews"), "key");

  return (
    <>
      {proofsToShow.map(({ key }, index) => (
        <Text key={key}>
          <Icon name={`social-${key}`} color={color} />
          {index !== proofsToShow.length - 1 && "  "}
        </Text>
      ))}
    </>
  );
};
