import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ItemService } from "./services/item";
import { CommentResolver, ItemResolver, JobStoryResolver, StoryResolver } from "./resolvers/item";
import { UserService } from "./services/user";
import { UserResolver } from "./resolvers/user";
import { ReadabilityService } from "./services/readability";

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ["./**/*.graphql"],
    }),
  ],
  controllers: [],
  providers: [
    ItemService,
    ItemResolver,
    JobStoryResolver,
    StoryResolver,
    CommentResolver,
    ReadabilityService,
    UserService,
    UserResolver,
  ],
})
export class AppModule {}
