import { Args, Parent, Query, ResolveProperty, Resolver } from "@nestjs/graphql";
import { ItemService } from "../services/item";
import { Item, User } from "../types/types";
import { UserService } from "../services/user";

@Resolver("Item")
export class ItemResolver {
  constructor(private readonly itemService: ItemService, private readonly userService: UserService) {}

  @Query("item")
  async findItem(@Args("id") id: string): Promise<Item> {
    let item = await this.itemService.findOneById(id);
    console.log(item)
    return item;
  }

  @ResolveProperty("by")
  async findAuthor(@Parent() item: Item): Promise<User> {
    let user = await this.userService.findOneById(item.by);
    console.log(user);
    return user;
  }

  @ResolveProperty()
  __resolveType(item: Item) {
    if (item.type === "story") {
      return "Story";
    }
    return "Comment";
  }
}

@Resolver("Comment")
export class CommentResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveProperty("by")
  async findAuthor(@Parent() item: Item): Promise<User> {
    let user = await this.userService.findOneById(item.by);
    console.log(user);
    return user;
  }
}

@Resolver("Story")
export class StoryResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveProperty("by")
  async findAuthor(@Parent() item: Item): Promise<User> {
    let user = await this.userService.findOneById(item.by);
    console.log(user);
    return user;
  }
}
