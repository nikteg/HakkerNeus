import { Args, Query, Resolver } from "@nestjs/graphql";
import { User } from "../types/types";
import { UserService } from "../services/user";

@Resolver("User")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query("user")
  findUser(@Args("id") id: string): Promise<User> {
    return this.userService.findOneById(id);
  }
}
