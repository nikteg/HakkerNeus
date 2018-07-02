import * as koa from "koa"; // koa@2
import * as koaRouter from "koa-router";
import * as koaBody from "koa-bodyparser";
import * as DataLoader from "dataloader";
import fetch from "node-fetch";
import * as _ from "lodash";
import { graphqlKoa, graphiqlKoa } from "apollo-server-koa";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import { Item } from "./typings/api";
import { fetchReadability, readabilityLoader } from "./resources/readability";

require("dotenv").config();

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

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
    async item(root, { id }) {
      return itemsLoader.load(id);
    },
  },
  Item: {
    __resolveType(obj) {
      if (obj.type === "comment") {
        return "Comment";
      }

      return "Story";
    },
  },
  Comment: {
    async by(root, args) {
      return root.by ? userLoader.load(root.by) : null;
    },
    async kids(root, args) {
      return root.kids ? itemsLoader.loadMany(root.kids) : null;
    },
  },
  Story: {
    async by(root, args) {
      return root.by ? userLoader.load(root.by) : null;
    },
    async kids(root, args) {
      return root.kids ? itemsLoader.loadMany(root.kids) : null;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers, logger: { log: (e) => console.log("GraphQL", e) } });

router.post("/graphql", graphqlKoa({ schema }));
router.get("/graphql", graphqlKoa({ schema }));

async function fetchJSON<T = any>(url: string): Promise<T> {
  const cachedUrl = url.replace("https://", "http://localhost:4000/https/");
  const json = await fetch(url).then((res) => res.json());
  // console.log(JSON.stringify(json, null, 2));

  return json;
}

function fetchItems() {
  return fetchJSON("https://hacker-news.firebaseio.com/v0/topstories.json");
}

async function fetchItem(key: number) {
  const item = await fetchJSON<Item>(`https://hacker-news.firebaseio.com/v0/item/${key}.json`);

  if (item.type === "story") {
    try {
      const readabilityData = await readabilityLoader.load(item.url);
      item.content = readabilityData;
    } catch (e) {
      console.error(e);
    }
  }

  return item;
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

  return fetch(`https://mercury.postlight.com/parser?url=${encodeURIComponent(url)}`, init)
    .then((res) => res.json())
    .then((json) => (json.error ? Promise.reject(json.messages) : Promise.resolve(json)));
}

router.get("/readability", async (ctx) => {
  const url = ctx.query.url;

  try {
    const data = await fetchReadability(url);
    ctx.append("Content-Type", "application/json");
    ctx.body = data;
  } catch (error) {
    console.error(url, error);
    ctx.status = 400;
    ctx.body = { error };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
