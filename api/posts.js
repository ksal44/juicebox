const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');
const { requireUser } = require('./utils')

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
  
    const tagArr = tags.trim().split(/\s+/)
    const postData = {};
  

    if (tagArr.length) {
      postData.tags = tagArr;
    }
  
    try {
      const post = await createPost({
        authorId,
         title,
        content
        });

        if (post) {
            res.send({ post })
        } else {
            console.log('cannont get post')
        }

    } catch ({ name, message }) {
      next({ name, message });
    }
  });


postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");

    next();
});

postsRouter.get('/', async (req, res, next) => {
    try {
      const allPosts = await getAllPosts();
  
      const posts = allPosts.filter(post => {
        return post.active || (req.user && post.author.id === req.user.id);
      });
  
      res.send({
        posts
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });
  
        res.send({ post: updatedPost });
      } else {
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a post which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });


module.exports = postsRouter;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2NzQxNzc4NTF9.zedYj9jFhbmZmWHAIHiN8x6zlTKNH6QNi36nZhqwgZI