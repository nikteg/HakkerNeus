import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ItemService } from "./services/item";
import { CommentResolver, ItemResolver, StoryResolver } from "./resolvers/item";
import { UserService } from "./services/user";
import { UserResolver } from "./resolvers/user";

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ["./**/*.graphql"],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ItemService, ItemResolver, StoryResolver, CommentResolver, UserService, UserResolver],
})
export class AppModule {}
