export type Item = Story | JobStory | PollItem | PollOption | Comment;

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
};

export type ItemWithChildren = Story | Comment | PollItem;

export type JobStory = {
  by: string;
  id: number;
  score: number;
  text: string;
  time: number;
  title: string;
  type: "job";
  url: string;
};

export type PollItem = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  parts: number[];
  score: number;
  time: number;
  text: string;
  title: string;
  type: "poll";
};

export type PollOption = {
  by: string;
  id: number;
  poll: number;
  score: number;
  text: string;
  time: number;
  type: "pollopt";
};

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

export interface ProofTuple {
  key: string;
  url: string;
}

export interface KeybaseResponse {
  status: {
    code: number;
    name: string;
  };
  them: {
    id: string;
    basics: Basics;
    proofs_summary: {
      all: Proof[];
    };
  }[];
}
interface Basics {
  username: string;
  ctime: number;
  mtime: number;
  id_version: number;
  track_version: number;
  last_id_change: number;
  username_cased: string;
  status: number;
  salt: string;
  eldest_seqno: number;
}

interface Proof {
  proof_type: string;
  nametag: string;
  state: number;
  proof_url: string;
  sig_id: string;
  proof_id: string;
  human_url: string;
  service_url: string;
  presentation_group: string;
  presentation_tag: string;
}
