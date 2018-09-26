/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CommentFields
// ====================================================

export interface CommentFields_by_proofs {
  __typename: "Proof";
  key: string;
  url: string;
}

export interface CommentFields_by {
  __typename: "User";
  id: string;
  proofs: CommentFields_by_proofs[];
}

export interface CommentFields {
  __typename: "Comment";
  id: number;
  text: string | null;
  time: number;
  by: CommentFields_by | null;
}
