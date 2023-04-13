import express from 'express';
import Post from '../models/posts.js';
import Comment from '../models/comment.js';
import Report from '../models/reports.js';
const router = express.Router();

router.post('/create',
  async (req, res) => {
    const { postId, userId, text } = req.body;
    try {
      const comment = new Comment({ text, userId, postId });
      await comment.save();

      const post = await Post.findByIdAndUpdate(postId, { $addToSet: { comments: comment._id } });
      await post.save()
      if (!post) throw new Error('Post not found');

      res.status(201).json(post);
    } catch (error) {
      console.log("line 20 routes/comments.js" + error)
    }
  });
export default router;