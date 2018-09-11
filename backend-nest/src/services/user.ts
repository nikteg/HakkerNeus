import { fetchJSON } from "../lib/fetch";
import { Injectable } from "@nestjs/common";
import { KeybaseResponse, ProofTuple, User } from "../types/types";

@Injectable()
export class UserService {
  findOneById(id: string): Promise<User> {
    return fetchJSON(`https://hacker-news.firebaseio.com/v0/user/${id}.json`);
  }

  async lookupProofs(id: string): Promise<ProofTuple[]> {
    const result = await fetchJSON<KeybaseResponse>(
      `https://keybase.io/_/api/1.0/user/lookup.json?hackernews=${id}&fields=proofs_summary`,
    );

    if (result.status.code !== 0 || !result.them[0]) {
      return [];
    }

    return result.them[0].proofs_summary.all
      .map((proof) => ({ key: proof.proof_type, url: proof.service_url }))
      .filter((p) => p.key !== "dns");
  }
}
