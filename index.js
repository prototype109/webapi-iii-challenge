// code away!
const express = require("express");

const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

server = express();

server.use(express.json());
server.use(logger);
server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

server.listen(4000, () => {
  console.log("server listening on http://localhost:4000/");
});

function logger(req, res, next) {
  const date = new Date();
  console.log(`${req.method} ${req.url} ${date.toISOString()}`);
  next();
}
