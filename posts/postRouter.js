const express = require("express");

const postDb = require("./postDb");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allPosts = await postDb.get();
    if (allPosts.length > 0) {
      res.status(200).json(allPosts);
    } else {
      res.status(500).json({ message: "Failed to get array of posts" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", validatePostId, (req, res) => {
  if (req.post) {
    res.status(200).json(req.post);
  } else {
    res
      .status(500)
      .json({ message: "Should not be getting here in get post by id" });
  }
});

router.delete("/:id", validatePostId, async (req, res) => {
  try {
    const successDelete = await postDb.remove(req.post.id);
    if (successDelete) {
      res.status(204).end();
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong when deleting user" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", validatePostId, validatePost, async (req, res) => {
  try {
    const addPost = await postDb.update(req.post.id, req.newPost);
    if (addPost) {
      res.status(200).json({ message: "Successfully updated post" });
    } else {
      res.status(500).json({ message: "Something went wrong editing a post" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  const id = req.params.id;

  try {
    const post = await postDb.getById(id);
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({ message: "There is no valid id for that post" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

function validatePost(req, res, next) {
  const reqBody = req.body;

  if (Object.keys(reqBody).length > 0) {
    if (reqBody.text) {
      req.newPost = { ...reqBody, user_id: req.post.user_id };
      next();
    } else {
      res.status(400).json({ message: "missing required text field" });
    }
  } else {
    res.status(400).json({ message: "missing post data" });
  }
}

module.exports = router;
