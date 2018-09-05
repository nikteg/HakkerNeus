import { fetchJSON } from "../lib/fetch";
import { Injectable } from "@nestjs/common";
import { User } from "../types/types";

@Injectable()
export class UserService {
  findOneById(id: string): Promise<User> {
    return fetchJSON(`https://hacker-news.firebaseio.com/v0/user/${id}.json`);
  }
}