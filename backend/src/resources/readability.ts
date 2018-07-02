import fetch from "node-fetch";
import * as DataLoader from "dataloader";

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

export function fetchReadability(url: string): Promise<ReadabilityResponse> {
  const init = {
    method: "GET",
    headers: { "x-api-key": process.env.MERCURY_API_KEY },
  };

  return fetch(`https://mercury.postlight.com/parser?url=${encodeURIComponent(url)}`, init)
    .then((res) => (res.status === 200 ? res.text() : res.json().then((json) => Promise.reject(json))))
    .then((text) => {
      const json = JSON.parse(text);
      return json.error ? Promise.reject(json.messages) : Promise.resolve(json);
    })
    .catch((error) => Promise.reject("Could not parse content"));
}

export type URL = string;

export const readabilityLoader = new DataLoader<URL, ReadabilityResponse>(
  (keys) => Promise.all(keys.map((key) => fetchReadability(key))),
  { batch: false },
);
