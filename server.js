const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("koa2-cors");
const koaBody = require("koa-body");
const faker = require("faker");

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));

let nextId = 3;
const content = faker.lorem.paragraph();

let posts = [
  {
    id: 1,
    content,
    avatar: "https://i.pravatar.cc/40",
    name: faker.name.findName(),
    created: Date.now(),
  },
  {
    id: 2,
    content,
    avatar: "https://i.pravatar.cc/40",
    name: faker.name.findName(),
    created: Date.now(),
  },
];

const router = new Router();

router.get("/posts", async (ctx, next) => {
  ctx.response.body = posts;
});

router.post("/posts", async (ctx, next) => {
  const body = JSON.parse(ctx.request.body);
  const { id, content } = body;

  if (id !== 0) {
    posts = posts.map((o) => (o.id !== id ? o : { ...o, content: content }));
    ctx.response.status = 204;
    return;
  }
  posts.push({
    ...body,
    id: nextId++,
    created: Date.now(),
    avatar: "https://i.pravatar.cc/40",
    name: faker.name.findName(),
  });
  console.log(posts);
  ctx.response.status = 204;
});

router.delete("/posts/:id", async (ctx, next) => {
  const postId = Number(ctx.params.id);
  const index = posts.findIndex((o) => o.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log("server started"));