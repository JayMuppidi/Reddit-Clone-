import express from 'express';
import Subgrediit from '../models/Subgrediit.js'
import User from '../models/mongoUsers.js'
import Post from '../models/posts.js';
import Comment from '../models/comment.js';
import Report from '../models/reports.js';
import fuzzySearch from "fuzzy-search";
import { ObjectId } from 'mongodb';
const router = express.Router();
router.get('/savedPosts/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const savedPostsIds = user.savedPosts;
    const savedPosts = await Promise.all(
      savedPostsIds.map(async (postId) => {
        const post = await Post.findById(postId);
        return post;
      })
    );
    return res.json(savedPosts);
  } catch (error) {
    console.log("line 25 routes/post.js" + error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/comments/:postId', async (req, res) => {
  
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'post not found' });
    }

    const commentIds = post.comments;
    const comments = await Promise.all(
      commentIds.map(async (postId) => {
        const comment = await Comment.findById(postId);
        const userrr = await User.findById(comment.userId)
        const uName= userrr.uName;
        return {...comment,uName};
      })
    );
    return res.json(comments);
  } catch (error) {
    console.log("line 49 routes/post.js" + error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    // Delete the post
    const post = await Post.findById(id);
    console.log(post)
    post.status= 'deleted';
    post.save()
    Subgrediit.updateOne(
      { 'posts.postId': id }, // find the subgrediit with the specified post ID
      { $set: { 'posts.$.status': 'deleted' } } // set the status of the matching post object to "deleted"
    )
      
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Delete the comments on the post
    const comments = await Comment.find({ postId: id });
    for (const comment of comments) {
      await comment.remove();
    }

    // Remove the post from every user's saved posts array
    const users = await User.find({ savedPosts: id });
    for (const user of users) {
      user.savedPosts.pull(id);
      await user.save();
    }

    await Report.deleteMany({ postId: id });

    res.status(200).json({ msg: 'Post deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




router.post('/create',
  async (req, res) => {
    const { text, userId, subgreddiitId } = req.body;
    try {
      const post = new Post({ text, userId, subgreddiitId });
      await post.save();

      // add the post to the subgreddit's list of posts
      const subgreddiit = await Subgrediit.findByIdAndUpdate(subgreddiitId, { $addToSet: { posts: post._id } });
      if (!subgreddiit) throw new Error('Subgreddiit not found');

      res.status(201).json(post);
    } catch (error) {
      console.log("line 28 routes/post.js" + error)
      next(error);
    }
  });


router.post('/savee',
  async (req, res) => {
    try {
      const { postId, userId } = req.body;
      const post = await Post.findById(postId);
      const user = await User.findById(userId);

      if (!post || !user) {
        return res.status(404).json({ error: 'Post or user not found' });
      }
      if (user.savedPosts.includes(postId)) {
        return res.status(200).json({ msg: 'Post already saved' });
      }
      // Add post to user's saved posts and user to post's savedBy array
      user.savedPosts.push(post);
      post.savedBy.push(user);

      await user.save();
      await post.save();

      return res.json({ message: 'Post added to saved posts' });
    } catch (error) {
      // console.error(error);
      // console.log(error.message);
      return res.status(500).json({ error: 'Server error' });
    }
  });
router.post('/unsavee',
async (req, res) => {
  try {
      const { postId, userId } = req.body;
      const post = await Post.findById(postId);
      const user = await User.findById(userId);

      if (!post || !user) {
        return res.status(404).json({ error: 'Post or user not found' });
      }

      // Add post to user's saved posts and user to post's savedBy array
      user.savedPosts.pull(post);
      post.savedBy.pull(user);


      await user.save();
      await post.save();

      return res.json({ message: 'Post added to saved posts' });
    } catch (error) {
      // console.error(error);
      // console.log(error.message);
      return res.status(500).json({ error: 'Server error' });
    }
  });
  router.put('/upvote/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id)
      if (!post) {
        console.log("post not found")
      }
      post.upvotes++;
      await post.save();
      res.status(200).json({msg:"Upvoted"})
    }
    catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  });
  router.put('/downvote/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id)
      if (!post) {
        console.log("post not found")
      }
      post.downvotes++;
      await post.save();
      res.status(200).json({msg:"Downvoted"})
    }
    catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  });
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
    if (!post) {
      console.log("post not found")
    }
    res.status(200).json(post)
  }
  catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
});
export default router;