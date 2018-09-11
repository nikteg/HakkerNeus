import { fetchJSON } from "../lib/fetch";
import { Injectable } from "@nestjs/common";
import { Item } from "../types/types";
import { take } from "lodash";

@Injectable()
export class ItemService {
  findOneById(id: number): Promise<Item> {
    return fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  }

  async getTopItems(limit: number): Promise<number[]> {
    const ids = await fetchJSON<number[]>(`https://hacker-news.firebaseio.com/v0/topstories.json`);

    return take(ids, limit);
  }
}
