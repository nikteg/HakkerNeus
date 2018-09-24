/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ItemType } from "./../../../_generated/globalTypes";

// ====================================================
// GraphQL query operation: CommentsQuery
// ====================================================

export interface CommentsQuery_item_Story_kids_by_proofs {
  __typename: "Proof";
  key: string;
  url: string;
}

export interface CommentsQuery_item_Story_kids_by {
  __typename: "User";
  id: string;
  proofs: CommentsQuery_item_Story_kids_by_proofs[];
}

export interface CommentsQuery_item_Story_kids {
  __typename: "Comment";
  id: number;
  text: string | null;
  time: number;
  by: CommentsQuery_item_Story_kids_by | null;
}

export interface CommentsQuery_item_Story {
  __typename: "Story";
  id: number;
  title: string | null;
  kids: CommentsQuery_item_Story_kids[];
  type: ItemType;
}

export interface CommentsQuery_item_JobStory {
  __typename: "JobStory";
  id: number;
  title: string | null;
  type: ItemType;
}

export interface CommentsQuery_item_Comment_kids_by_proofs {
  __typename: "Proof";
  key: string;
  url: string;
}

export interface CommentsQuery_item_Comment_kids_by {
  __typename: "User";
  id: string;
  proofs: CommentsQuery_item_Comment_kids_by_proofs[];
}

export interface CommentsQuery_item_Comment_kids {
  __typename: "Comment";
  id: number;
  text: string | null;
  time: number;
  by: CommentsQuery_item_Comment_kids_by | null;
}

export interface CommentsQuery_item_Comment {
  __typename: "Comment";
  id: number;
  kids: CommentsQuery_item_Comment_kids[];
  type: ItemType;
}

export type CommentsQuery_item = CommentsQuery_item_Story | CommentsQuery_item_JobStory | CommentsQuery_item_Comment;

export interface CommentsQuery {
  item: CommentsQuery_item | null;
}

export interface CommentsQueryVariables {
  storyId: number;
}
