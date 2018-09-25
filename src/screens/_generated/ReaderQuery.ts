

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReaderQuery
// ====================================================

export interface ReaderQuery_item_Comment {
  __typename: "Comment" | "JobStory";
  id: number;
  url: string | null;
  type: ItemType;
  title: string | null;
}

export interface ReaderQuery_item_Story_content {
  __typename: "ReadabilityResponse";
  lead_image_url: string | null;
  content: string;
}

export interface ReaderQuery_item_Story {
  __typename: "Story";
  id: number;
  url: string | null;
  type: ItemType;
  title: string | null;
  content: ReaderQuery_item_Story_content | null;
}

export type ReaderQuery_item = ReaderQuery_item_Comment | ReaderQuery_item_Story;

export interface ReaderQuery {
  item: ReaderQuery_item | null;
}

export interface ReaderQueryVariables {
  id: number;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ItemType {
  comment = "comment",
  job = "job",
  poll = "poll",
  pollopt = "pollopt",
  story = "story",
}

//==============================================================
// END Enums and Input Objects
//==============================================================