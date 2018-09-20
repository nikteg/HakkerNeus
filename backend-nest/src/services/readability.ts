import fetch, { RequestInit } from "node-fetch";
import { Injectable } from "@nestjs/common";
import { ReadabilityResponse } from "../types/types";
import * as DataLoader from "dataloader";

@Injectable()
export class ReadabilityService {
  private loader: DataLoader<string, ReadabilityResponse>;

  constructor() {
    const options: RequestInit = {
      headers: { "x-api-key": process.env.MERCURY_API_KEY },
      compress: false,
    };

    const fetchItem = (url: string) =>
      fetch(`https://mercury.postlight.com/parser?url=${url}`, options)
        .then((res) => (res.status === 200 ? res.json() : res.json().then((json) => Promise.reject(json))))
        .then((json) => (json.error ? Promise.reject(json.messages) : Promise.resolve(json)));

    this.loader = new DataLoader<string, ReadabilityResponse>((ids) => Promise.all(ids.map(fetchItem)), {
      batch: false,
    });
  }

  fetchArticleForUrl(url: string): Promise<ReadabilityResponse> {
    return this.loader.load(url);
  }
}
