/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CommentFragment
// ====================================================

export interface CommentFragment_by_proofs {
  __typename: "Proof";
  key: string;
  url: string;
}

export interface CommentFragment_by {
  __typename: "User";
  id: string;
  proofs: CommentFragment_by_proofs[];
}

export interface CommentFragment {
  __typename: "Comment";
  id: number;
  text: string | null;
  time: number;
  by: CommentFragment_by | null;
}
