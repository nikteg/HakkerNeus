
export type Item = Story | Comment;

export type Story = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: "story";
  url: string;
  content: ReadabilityResponse;
}

export type Comment = {
  by: string;
  id: number;
  kids: number[];
  parent: number;
  text: string;
  time: number;
  type: "comment";
};

export type User = {
  about?: string;
  created: number;
  id: string;
  delay?: number;
  karma: number;
  submitted: number[];
};


export interface ReadabilityResponse {
  title: string;
  author: string;
  date_published?: any;
  dek?: any;
  lead_image_url: string;
  content: string;
  next_page_url?: any;
  url: string;
  domain: string;
  excerpt: string;
  word_count: number;
  direction: string;
  total_pages: number;
  rendered_pages: number;
}