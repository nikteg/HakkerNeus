import { fetchJSON } from "../lib/fetch";
import { Injectable } from "@nestjs/common";
import { Item, KeybaseResponse, ProofTuple, User } from "../types/types";
import * as DataLoader from "dataloader";

@Injectable()
export class UserService {
  userLoader: DataLoader<string, User>;
  proofLoader: DataLoader<string, ProofTuple[]>;

  constructor() {
    const fetchUser = (id: string) => fetchJSON<User>(`https://hacker-news.firebaseio.com/v0/user/${id}.json`);

    const transformProof = (result: KeybaseResponse): ProofTuple[] => {
      if (result.status.code !== 0 || !result.them[0]) {
        return [];
      }

      return result.them[0].proofs_summary.all
        .map((proof) => ({ key: proof.proof_type, url: proof.service_url }))
        .filter((p) => p.key !== "dns");
    };

    const fetchProof = (id: string): Promise<ProofTuple[]> =>
      fetchJSON<KeybaseResponse>(
        `https://keybase.io/_/api/1.0/user/lookup.json?hackernews=${id}&fields=proofs_summary`,
      ).then(transformProof);

    this.userLoader = new DataLoader<string, User>((ids) => Promise.all(ids.map(fetchUser)));
    this.proofLoader = new DataLoader<string, ProofTuple[]>((ids) => Promise.all(ids.map(fetchProof)));
  }

  findOneById(id: string): Promise<User> {
    return this.userLoader.load(id);
  }

  async lookupProofs(id: string): Promise<ProofTuple[]> {
    return this.proofLoader.load(id);
  }
}
