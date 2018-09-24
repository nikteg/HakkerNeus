import * as React from "react";
import Icon from "react-native-vector-icons/Foundation";
import { sortBy } from "lodash";
import { Text } from "react-native";
import { ListViewQuery_items_by_proofs } from "../_generated/ListViewQuery";

type Props = {
  proofs: ListViewQuery_items_by_proofs[] | null;
  color: string;
};

export const ProofsBar = ({ proofs, color }: Props) => {
  if (!proofs) {
    return null;
  }

  const proofsToShow = sortBy(proofs.filter((p) => p.key !== "hackernews"), "key");

  return (
    <>
      {proofsToShow.map(({ key }) => (
        <Text key={key}>
          {" "}
          <Icon name={key === "generic_web_site" ? "web" : `social-${key}`} color={color} size={16} />
        </Text>
      ))}
    </>
  );
};
