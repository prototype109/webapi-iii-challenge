const express = require("express");

const userDb = require("./userDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  const addUser = await userDb.insert(req.body);
  res.json(addUser);
});

router.post("/:id/posts", (req, res) => {});

router.get("/", async (req, res) => {
  try {
    const users = await userDb.get();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong retrieving the users data" });
  }
});

router.get("/:id", (req, res) => {});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {}

function validateUser(req, res, next) {
  const reqBody = req.body;

  if (Object.keys(reqBody).length > 0) {
    if (reqBody.name) {
      next();
    } else {
      res.status(400).json({ message: "missing required name field" });
    }
  } else {
    res.status(400).json({ message: "missing user data" });
  }
}

function validatePost(req, res, next) {}

module.exports = router;
