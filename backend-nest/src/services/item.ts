import { fetchJSON } from "../lib/fetch";
import { Injectable } from "@nestjs/common";
import { Item } from "../types/types";

@Injectable()
export class ItemService {
  findOneById(id: string): Promise<Item> {
    return fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  }
}