const express = require("express");

const userDb = require("./userDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  const addUser = await userDb.insert(req.body);
  res.json(addUser);
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const addPost = userDb.insert(req.newPost);
  res.json(addPost);
});

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

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const posts = await userDb.getUserPosts(req.user.id);
    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "user does not have any posts" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong requesting the users posts" });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const successDelete = await userDb.remove(req.user.id);
    if (successDelete) {
      res.status(204).end();
    } else {
      res
        .status(500)
        .json({ message: "Should not be getting here in delete request" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Do not know what happened in delete request" });
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  try {
    const successEdit = await userDb.update(req.user.id, req.body);
    if (successEdit) {
      res.status(200).json({ message: "successfully update users" });
    } else {
      res.status(500).json({
        message: "Should not be getting here in else statement of put request"
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Should not be getting here in catch of put request" });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  const id = req.params.id;

  try {
    const validUserWithId = await userDb.getById(id);
    if (validUserWithId) {
      // console.log("User: ", validUserWithId);
      req.user = validUserWithId;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong trying to access the database" });
  }
}

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

function validatePost(req, res, next) {
  const reqBody = req.body;

  if (Object.keys(reqBody).length > 0) {
    if (reqBody.text) {
      req.newPost = { ...reqBody, user_id: req.params.id };
      next();
    } else {
      res.status(400).json({ message: "missing required text field" });
    }
  } else {
    res.status(400).json({ message: "missing post data" });
  }
}

module.exports = router;
