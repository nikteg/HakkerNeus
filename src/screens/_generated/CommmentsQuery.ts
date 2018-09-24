/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ItemType } from "./../../../_generated/globalTypes";

// ====================================================
// GraphQL query operation: CommmentsQuery
// ====================================================

export interface CommmentsQuery_item_JobStory {
  __typename: "JobStory" | "Comment";
}

export interface CommmentsQuery_item_Story_kids_by {
  __typename: "User";
  id: string;
}

export interface CommmentsQuery_item_Story_kids {
  __typename: "Comment";
  id: number;
  text: string | null;
  time: number;
  by: CommmentsQuery_item_Story_kids_by | null;
}

export interface CommmentsQuery_item_Story {
  __typename: "Story";
  id: number;
  title: string | null;
  kids: CommmentsQuery_item_Story_kids[] | null;
  type: ItemType | null;
}

export type CommmentsQuery_item = CommmentsQuery_item_JobStory | CommmentsQuery_item_Story;

export interface CommmentsQuery {
  item: CommmentsQuery_item | null;
}

export interface CommmentsQueryVariables {
  storyId: number;
}
