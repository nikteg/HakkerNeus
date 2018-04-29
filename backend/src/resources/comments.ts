import fetch from "node-fetch";
import * as DataLoader from "dataloader";
import { JSDOM } from "jsdom";
import { CommentAttributes } from "../typings/api";

export const commentAttributes = new Map<number, CommentAttributes>();

export const storyLoader = new DataLoader<number, object>(
  (keys) => Promise.all(keys.map((key) => fetchStoryComments(key))),
  { batch: false },
);

async function fetchStoryComments(id: number) {
  const dom = await fetchHTML(`https://news.ycombinator.com/item?id=${id}`);

  const rows = [...dom.window.document.querySelectorAll<HTMLTableRowElement>(".athing.comtr")];

  const attributes = rows.map((row) => {
    const span = row.querySelector<HTMLSpanElement>(".comment > span");
    const color = span ? span.className : null;

    return {
      id: Number(row.id),
      color,
    };
  });

  attributes.forEach((attr) => {
    commentAttributes.set(attr.id, attr);
  });

  return attributes;
}

function fetchHTML(url: string) {
  return JSDOM.fromURL(url);
}
