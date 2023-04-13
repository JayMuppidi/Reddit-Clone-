import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Subgrediit from '../models/Subgrediit.js'
import User from '../models/mongoUsers.js'
import Post from '../models/posts.js';
import Comment from '../models/comment.js';
import Report from '../models/reports.js';
const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const {id}= req.params;
    const user = await User.findById(id);
    if (!user) {
      console.log('User not found')
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
   
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.post('/edit', [
  body('id').not().isEmpty(),
  body('fName').not().isEmpty().withMessage('First name is required'),
  body('lName').not().isEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('uName').not().isEmpty().withMessage('User name is required'),
  body('age').isInt({ min: 14 }).withMessage('You must be older than 14'),
  body('phoneNo').not().isEmpty().withMessage('You need to enter a phone number ').isMobilePhone().withMessage('Invalid contact number format'),
],
  async (req, res) => {
    const { id, fName, lName, email, uName, age, phoneNo } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { fName, lName, email, uName, age, phoneNo },
        { new: true }
      );
      console.log(updatedUser);
      await updatedUser.save()
      //await User.save()
      console.log(updatedUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }

  });

  router.get('/followers/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const followerIds = user.followers;
      const followers = await Promise.all(
        followerIds.map(async (followerId) => {
          const user = await User.findById(followerId);
          return {_id:user._id,uName:user.uName};
        })
      );
      return res.json(followers);
    } catch (error) {
      console.log("line 25 routes/post.js" + error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.get('/following/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const followingIds = user.following;
const following = await Promise.all(
  followingIds.map(async (followingId) => {
    const user = await User.findById(followingId);
    return { _id: user._id, uName: user.uName };
  })
);
return res.json(following);
    } catch (error) {
      console.log("line 25 routes/post.js" + error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/blockedStatus/:userId', async (req, res) => {
    const { userId } = req.params;
    const subId  = req.body.subId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const subgrediit = await Subgrediit.findById(subId);
      if (!subgrediit) {
        return res.status(404).json({ error: 'Subgreddiit not found' });
      }
      const blockedUser = subgrediit.users.find(
        (u) => u.userId.toString() === userId && u.status === 'blocked'
      );
      const isBlocked = !!blockedUser;
      return res.json({ isBlocked });
    } catch (error) {
      console.log('line 25 routes/post.js' + error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Delete the post
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      post.status = true;
      await post.save();
  
      // Delete the comments on the post
      const comments = await Comment.find({ postId: post._id });
      for (const comment of comments) {
        await comment.remove();
      }
  
      // Remove the post from every user's saved posts array
      const users = await User.find({ savedPosts: post._id });
      for (const user of users) {
        user.savedPosts.pull(post._id);
        await user.save();
      }
  
      // Remove the post from every subgreddit's posts array
      const subgreddits = await Subgreddiit.find({ posts: post._id });
      for (const subgreddit of subgreddits) {
        subgreddit.posts.pull(post._id);
        await subgreddit.save();
      }
  
      res.status(200).json({ msg: 'Post deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


  router.put('/follow/:id', async (req, res) => {
    try {
    const { requester } = req.body;
    const tobeFollowedId = req.params.id;
    if (tobeFollowedId === requester) {
    console.log("User trying to follow self")
    res.status(200).json({ msg: "User trying to follow self" })
    } else {
    const tobeFollowed = await User.findById(tobeFollowedId);
    const requesterObj = await User.findById(requester);
    if (tobeFollowed.followers.includes(requester)) {
    console.log("User already following");
    res.status(200).json({ msg: "User already following" });
    } else {
    tobeFollowed.followers.push(requester);
    requesterObj.following.push(tobeFollowedId);
    await tobeFollowed.save();
    await requesterObj.save();
    res.status(200).json({ msg: "Added successfully" });
    }
    }
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }
    });


router.put('/unfollow/:id', async (req,res)=> {
  try{
    const { requesterId } = req.body;
    const tobeunFollowedId = req.params.id;
    const tobeunFollowed = await User.findById(tobeunFollowedId)
    const requester = await User.findById(requesterId)
    tobeunFollowed.followers = tobeunFollowed.followers.filter((follower) => {
      return follower.toString() !== requesterId.toString();
    });
    // Remove the to-be-unfollowed user from the follower list of the requester
    requester.following = requester.following.filter((following) => {
      return following.toString() !== tobeunFollowedId.toString();
    });
    await requester.save()
    await tobeunFollowed.save()
    res.status(200).json({msg: "Unfollowed successfully"})
  }
  catch (err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
export default router;