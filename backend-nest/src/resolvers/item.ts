import { Args, Parent, Query, ResolveProperty, Resolver } from "@nestjs/graphql";
import { ItemService } from "../services/item";
import { Item, User } from "../types/types";
import { UserService } from "../services/user";

@Resolver("Item")
export class ItemResolver {
  constructor(private readonly itemService: ItemService, private readonly userService: UserService) {}

  @Query("items")
  findItems(@Args("limit") limit: number): Promise<Item[]> {
    return this.itemService.getTopItems(Math.min(limit, 20));
  }

  @Query("item")
  findItem(@Args("id") id: number): Promise<Item> {
    return this.itemService.findOneById(id);
  }

  @ResolveProperty("by")
  findAuthor(@Parent() item: Item): Promise<User> {
    return this.userService.findOneById(item.by);
  }

  @ResolveProperty("kids")
  async findChildren(@Parent() item: Item): Promise<Item[]> {
    const items = await this.itemService.getManyItems(item.kids);
    return items.filter(item => item.by !== null);
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
export class CommentResolver extends ItemResolver {}

@Resolver("Story")
export class StoryResolver extends ItemResolver {}
