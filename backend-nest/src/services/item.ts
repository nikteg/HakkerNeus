import { fetchJSON } from "../lib/fetch";
import { Injectable } from "@nestjs/common";
import { Item } from "../types/types";
import { take, drop } from "lodash";
import * as DataLoader from "dataloader";

@Injectable()
export class ItemService {
  private loader: DataLoader<number, Item>;

  constructor() {
    const fetchItem = (id: number) => fetchJSON<Item>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(item => {
      if (!item.id || !item.by) { console.log(id, item) }

      return item;
    });

    this.loader = new DataLoader<number, Item>((ids) => Promise.all(ids.map(fetchItem)));
  }

  findOneById(id: number): Promise<Item> {
    return this.loader.load(id);
  }

  async getManyItems(ids: number[]): Promise<Item[]> {
    const items = await this.loader.loadMany(ids);

    return items.filter((i: any) => !i.deleted);
  }

  async getTopItems(limit: number, offset: number): Promise<Item[]> {
    const ids = await fetchJSON<number[]>(`https://hacker-news.firebaseio.com/v0/topstories.json`);

    const limitedIds = take(drop(ids, offset), limit);

    return this.getManyItems(limitedIds);
  }
}
