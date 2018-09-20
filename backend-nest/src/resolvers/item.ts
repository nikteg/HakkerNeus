import { Args, Parent, Query, ResolveProperty, Resolver } from "@nestjs/graphql";
import { ItemService } from "../services/item";
import { Item, Story, User, Comment, ItemWithChildren } from "../types/types";
import { UserService } from "../services/user";
import { ReadabilityService } from "../services/readability";

const typeToResolverMap = {
  story: "Story",
  comment: "Comment",
  job: "JobStory",
  poll: "PollItem",
  pollopt: "PollOption",
};

@Resolver("Item")
export class ItemResolver {
  constructor(protected readonly itemService: ItemService, protected readonly userService: UserService) {}

  @Query("topstories")
  findItems(@Args("first") first: number = 20, @Args("offset") offset: number = 0): Promise<Item[]> {
    console.log({ first, offset });
    return this.itemService.getTopItems(Math.min(first, 20), offset);
  }

  @Query("item")
  findItem(@Args("id") id: number): Promise<Item> {
    return this.itemService.findOneById(id);
  }

  @ResolveProperty("by")
  findAuthor(@Parent() item: Item): Promise<User> {
    return this.userService.findOneById(item.by);
  }

  @ResolveProperty()
  __resolveType(item: Item) {
    return typeToResolverMap[item.type];
  }
}

class ItemWithChildrenResolver<T extends ItemWithChildren> extends ItemResolver {
  @ResolveProperty("kids")
  async findChildren(@Parent() item: T): Promise<T[]> {
    const items = await this.itemService.getManyItems(item.kids) as T[];
    return items.filter((item) => item.by !== null);
  }
}

@Resolver("JobStory")
export class JobStoryResolver extends ItemResolver {}

@Resolver("Comment")
export class CommentResolver extends ItemWithChildrenResolver<Comment> {}

@Resolver("Story")
export class StoryResolver extends ItemWithChildrenResolver<Story> {

  constructor(itemService: ItemService, userService: UserService, private readonly readabilityService: ReadabilityService) {
    super(itemService, userService);
  }

  @ResolveProperty("content")
  getContent(item: Item) {
    return this.readabilityService.fetchArticleForUrl((item as Story).url);
  }
}
