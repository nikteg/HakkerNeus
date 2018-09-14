import { fetchJSON } from "../lib/fetch";
import { Injectable } from "@nestjs/common";
import { Item } from "../types/types";
import { take } from "lodash";
import * as DataLoader from "dataloader";

@Injectable()
export class ItemService {
  private loader: DataLoader<number, Item>;

  constructor() {
    const fetchItem = (id: number) => fetchJSON<Item>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);

    this.loader = new DataLoader<number, Item>((ids) => Promise.all(ids.map(fetchItem)));
  }

  findOneById(id: number): Promise<Item> {
    return this.loader.load(id);
  }

  getManyItems(ids: number[]): Promise<Item[]> {
    return this.loader.loadMany(ids);
  }

  async getTopItems(limit: number): Promise<Item[]> {
    const ids = await fetchJSON<number[]>(`https://hacker-news.firebaseio.com/v0/topstories.json`);

    const limitedIds = take(ids, limit);

    return this.getManyItems(limitedIds);
  }
}
