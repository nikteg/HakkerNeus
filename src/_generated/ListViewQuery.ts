/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ItemType } from "./../../_generated/globalTypes";

// ====================================================
// GraphQL query operation: ListViewQuery
// ====================================================

export interface ListViewQuery_items_Comment {
  __typename: "Comment";
}

export interface ListViewQuery_items_Story_by_proofs {
  __typename: "Proof";
  key: string;
  url: string;
}

export interface ListViewQuery_items_Story_by {
  __typename: "User";
  id: string;
  proofs: ListViewQuery_items_Story_by_proofs[];
}

export interface ListViewQuery_items_Story_content {
  __typename: "ReadabilityResponse";
  content: string;
  lead_image_url: string | null;
}

export interface ListViewQuery_items_Story {
  __typename: "Story";
  id: number;
  score: number;
  time: number;
  by: ListViewQuery_items_Story_by | null;
  title: string | null;
  url: string | null;
  type: ItemType | null;
  descendants: number | null;
  content: ListViewQuery_items_Story_content | null;
}

export interface ListViewQuery_items_JobStory_by {
  __typename: "User";
  id: string;
}

export interface ListViewQuery_items_JobStory {
  __typename: "JobStory";
  id: number;
  score: number;
  by: ListViewQuery_items_JobStory_by | null;
  title: string | null;
  time: number;
  url: string | null;
  type: ItemType | null;
}

export type ListViewQuery_items = ListViewQuery_items_Comment | ListViewQuery_items_Story | ListViewQuery_items_JobStory;

export interface ListViewQuery {
  items: ListViewQuery_items[] | null;
}

export interface ListViewQueryVariables {
  offset: number;
}
