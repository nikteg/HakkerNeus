/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ItemType } from "./../../_generated/globalTypes";

// ====================================================
// GraphQL query operation: ListViewQuery
// ====================================================

export interface ListViewQuery_items_by_proofs {
  __typename: "Proof";
  key: string;
  url: string;
}

export interface ListViewQuery_items_by {
  __typename: "User";
  id: string;
  proofs: ListViewQuery_items_by_proofs[];
}

export interface ListViewQuery_items {
  __typename: "Story";
  id: number;
  score: number;
  time: number;
  by: ListViewQuery_items_by;
  title: string | null;
  url: string | null;
  type: ItemType;
  descendants: number | null;
}

export interface ListViewQuery {
  items: ListViewQuery_items[];
}

export interface ListViewQueryVariables {
  offset: number;
}
