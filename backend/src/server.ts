import * as koa from "koa"; // koa@2
import * as koaRouter from "koa-router";
import * as koaBody from "koa-bodyparser";
import * as DataLoader from "dataloader";
import fetch from "node-fetch";
import * as _ from "lodash";
import * as CachingProxy from "caching-proxy";
import { graphqlKoa, graphiqlKoa } from "apollo-server-koa";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";

require("dotenv").config();

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

const proxy = new CachingProxy({
  port: 4000,
  dir: "./cached-data",
});

// koaBody is needed just for POST.
app.use(koaBody());

const itemsLoader = new DataLoader<number, object>((keys) => Promise.all(keys.map((key) => fetchItem(key))));
const userLoader = new DataLoader<string, object>((keys) => Promise.all(keys.map((key) => fetchUser(key))));

const typeDefs = importSchema("./src/schema.graphql");
const resolvers = {
  Query: {
    async items(root, { limit = 20 }) {
      const ids: number[] = _.take(await fetchItems(), Math.min(20, limit));
      return itemsLoader.loadMany(ids);
    },
  },
  Item: {
    async by(root, args) {
      return root.by ? userLoader.load(root.by) : null;
    },
    async kids(root, args) {
      return root.kids ? itemsLoader.loadMany(root.kids) : null;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

router.post("/graphql", graphqlKoa({ schema }));
router.get("/graphql", graphqlKoa({ schema }));

function fetchJSON(url: string) {
  const cachedUrl = url.replace("https://", "http://localhost:4000/https/");
  return fetch(url).then((res) => res.json());
}

function fetchItems() {
  return fetchJSON("https://hacker-news.firebaseio.com/v0/topstories.json");
}

function fetchItem(key: number) {
  return fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${key}.json`);
}

function fetchUser(key: string) {
  return fetchJSON(`https://hacker-news.firebaseio.com/v0/user/${key}.json`);
}

// Setup the /graphiql route to show the GraphiQL UI
router.get(
  "/graphiql",
  graphiqlKoa({
    endpointURL: "/graphql", // a POST endpoint that GraphiQL will make the actual requests to
  }),
);

function fetchReadability(url: string) {
  const init = {
    method: "GET",
    headers: { "x-api-key": process.env.MERCURY_API_KEY },
  };

  return fetch(`https://mercury.postlight.com/parser?url=${encodeURIComponent(url)}`, init).then((res) => res.text());
}

router.get("/readability", async (ctx) => {
  const url = ctx.request.query.url;

  const data = await fetchReadability(url);

  ctx.response.append("Content-Type", "application/json");
  ctx.response.body = data;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
