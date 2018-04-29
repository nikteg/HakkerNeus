export type User = {
  about: string;
  created: number;
  delay: number;
  id: string;
  karma: number;
  submitted: number[];
};

export type Item =
  | {
      by: string;
      descendants: number;
      id: number;
      kids: number[];
      score: number;
      time: number;
      title: string;
      type: "story";
      url: string;
    }
  | {
      by: string;
      id: number;
      kids: number[];
      parent: number;
      text: string;
      time: number;
      attributes: CommentAttributes | null;
      type: "comment";
    };

export type CommentAttributes = {
  id: number;
  color: string | null;
};