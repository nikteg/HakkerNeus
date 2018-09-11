import { Args, Query, Resolver, ResolveProperty, Parent } from "@nestjs/graphql";
import { ProofTuple, User } from "../types/types";
import { UserService } from "../services/user";

@Resolver("User")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query("user")
  findUser(@Args("id") id: string): Promise<User> {
    return this.userService.findOneById(id);
  }

  @ResolveProperty("proofs")
  getProofs(@Parent() user: User): Promise<ProofTuple[]> {
    return this.userService.lookupProofs(user.id);
  }
}
