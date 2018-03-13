import * as koa from "koa"; // koa@2
import * as koaRouter from "koa-router";
import * as koaBody from "koa-bodyparser";
import * as DataLoader from "dataloader";
import fetch from "node-fetch";
import { graphqlKoa, graphiqlKoa } from "apollo-server-koa";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

// koaBody is needed just for POST.
app.use(koaBody());

const itemsLoader = new DataLoader<number, object>((keys) => Promise.all(keys.map((key) => fetchItem(key))));

const typeDefs = importSchema("./src/schema.graphql");
const resolvers = {
  Query: {
    async items() {
      return itemsLoader.loadMany(await fetchItems());
    },
  },
  Item: {
    async kids(root, args) {
      return root.kids ? itemsLoader.loadMany(root.kids) : null;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

router.post("/graphql", graphqlKoa({ schema }));
router.get("/graphql", graphqlKoa({ schema }));

function fetchJSON(url: string) {
  return fetch(url).then((res) => res.json());
}

function fetchItems() {
  return fetchJSON("https://hacker-news.firebaseio.com/v0/topstories.json");
}

function fetchItem(key: number) {
  return fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${key}.json`);
}

// Setup the /graphiql route to show the GraphiQL UI
router.get(
  "/graphiql",
  graphiqlKoa({
    endpointURL: "/graphql", // a POST endpoint that GraphiQL will make the actual requests to
  }),
);

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
