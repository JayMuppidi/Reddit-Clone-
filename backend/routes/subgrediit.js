import express from 'express';
import Subgrediit from '../models/Subgrediit.js'
import User from '../models/mongoUsers.js'
import Post from '../models/posts.js';
import Comment from '../models/comment.js';
import Report from '../models/reports.js';
import fuzzySearch from "fuzzy-search";
const router = express.Router();


router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const subgreddits = await Subgrediit.find().exec(); // retrieve all subgreddits from the database
    const searcher = new fuzzySearch(subgreddits, ['name']); // create a new fuzzy searcher on the 'name' property
    const results = searcher.search(query); // perform a fuzzy search on the query string
    res.json(results); // send the search results back to the client
  } catch (error) {
    console.log("line 21"+error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create',
async(req,res)=>{
    const { name, description, moderatorId, tags, bannedWords,imgUrl } = req.body;
    try {
       // const { name, description, tags, bannedWords, userId } = subgreddit;
        const newSubgreddit = new Subgrediit({
          name,
          description,
          tags,
          bannedWords,
          imgUrl,
          moderatorId: moderatorId,
          users: [{ status: 'moderator', userId: moderatorId, date: Date.now() }]
        });
        await newSubgreddit.save();
        const user = await User.findById(moderatorId);
        user.subgreddiits.push({
          status: "moderator",
          subgreddiitId: newSubgreddit._id,
          date: Date.now(),
        });
        await user.save();   
        res.status(201).json(newSubgreddit)
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Unkown error")
      }
});



router.get('/allSubs', async (req,res)=>{
  Subgrediit.find({}, function(err, subgreddiits) {
    if (err) {
      console.error(err);
    } else {
      res.status(200).json(subgreddiits)
    }
  });
});

router.get('/posts/:id', async (req, res) => {
  try {
    const {id}= req.params;
    const sub = await Subgrediit.findById(id);
    if (!sub) {
      console.log('line 40 :Subgreddiit not found')
      return res.status(404).json({ msg: 'Subgreddiit not found' });
    }
    const posts = await Post.find({ subgreddiitId: sub._id, status: { $ne: 'deleted' } });
    res.status(200).json(posts);
   
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/requestedUsers/:id', async (req, res) => {
  try {
    const {id}= req.params;
    const sub = await Subgrediit.findById(id);
    if (!sub) {
      console.log('line 40 :Subgreddiit not found')
      return res.status(404).json({ msg: 'Subgreddiit not found' });
    }
    const requestedUsers = await User.find({ subgreddiitId: sub._id, status: "requested" });
    const usersData = requestedUsers.map(user => ({ _id: user._id, uName: user.uName }));
    res.status(200).json(usersData);
   
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the subgreddiit
    const subgreddiit = await Subgrediit.findById(id);
    if (!subgreddiit) {
      return res.status(404).json({ msg: 'Subgreddiit not found' });
    }
    await subgreddiit.remove();

    // Delete the posts in the subgreddiit and comments on those posts
    const posts = await Post.find({ subgreddiitId: id });
    for (const post of posts) {
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
      await post.remove();
    }
    await Report.deleteMany({ subgreddiitId: id });


    const users = await User.find({ 'subgreddiits.subgreddiitId': id });
    for (const user of users) {
      user.subgreddiits = user.subgreddiits.filter((sub) => sub.subgreddiitId.toString() !== id);
      await user.save();
    }
    res.status(200).json({ msg: 'Subgreddiit deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.put("/addReport", async (req, res) => {
  
  try {
    // Create a new report object from the request body
    const newReport = new Report({
      reporterId: req.body.reporterId,
      reporteeId: req.body.reporteeId,
      concern: req.body.concern,
      subgreddiitId: req.body.subgreddiitId,
      postId: req.body.postId,
    });

    // Save the new report to the database
    const savedReport = await newReport.save();
    // Find the subgreddiit associated with the reported post
    const subgreddiit = await Subgrediit.findById(req.body.subgreddiitId);

    // Find the post being reported
    const post = Subgrediit.findOne(
      {"._id":req.body.subgreddiitId},
      { "posts.postId": req.body.postId }
    );
    // Update the post's status to reportedOnce
    post.status = "reportedOnce";

    // Add the report to the subgreddiit's list of reports
    subgreddiit.reports.push({ reportId: savedReport._id });

    // Save the updated subgreddiit to the database
    await subgreddiit.save();

    // Return the saved report as a response
    res.status(201).json(savedReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not add report." });
  }
});

router.get('/ignoreReport/:reportId', async(req,res)=>{
  const {reportId}=req.params;
  const report = await Report.findById(reportId)
  report.status="ignored"
  report.save()
  res.status(201).json({message:"Sucessfully ignored"})
})

router.get('/reports/:subID', async (req, res) => {
  const { subID } = req.params;
  const days = 10;
   const reports = await Report.find({subgreddiitId:subID, $or: [{ status: 'Neutral' }, {status:"blocked"}, {status:"ignored"}]})
     .populate('postId', ' -__v')
     .populate('reporterId', ' -__v')
     .populate('reporteeId', ' -__v')
     .populate('subgreddiitId', '-_id -__v');
  
  // Delete reports older than 'days' days
  reports.forEach(async (report) => {
    const daysSinceReport = (Date.now() - report.date) / (24 * 60 * 60 * 1000);
    if (report.status === 'Neutral' && daysSinceReport >= days) {
      await report.remove();
    }
  });

  // Send response with all attributes of report, post and text
  res.status(200).json(reports);
});



router.put("/add/:subID", async (req, res) => {
  try {
    const { subID } = req.params;
    const { userId } = req.body;
  
    // Check if subgreddit exists
    const subgreddit = await Subgrediit.findById(subID);
    if (!subgreddit) {
      return res.status(404).json({ message: "Subgreddit not found." });
    }
  
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const objIndex = user.subgreddiits.findIndex(subG => subG.subgreddiitId.toString() === subID)
    console.log(user.subgreddiits)
    console.log("line200:"+subID)
    user.subgreddiits[objIndex].status = "joined";

    user.save();
  

   const  secIndex = subgreddit.users.findIndex(user => user.userId.toString() === userId)
    subgreddit.users[secIndex].status = "member";

    subgreddit.save();

    res.status(200).json({ message: "Successfully accepted into subgreddit." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});
router.put("/join/:subID", async (req, res) => {
  try {
  const { subID } = req.params;
  const { userId } = req.body;
  
  // Check if subgreddit exists
  const subgreddit = await Subgrediit.findById(subID);
  if (!subgreddit) {
    return res.status(404).json({ message: "Subgreddit not found." });
  }
  
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  
  // Check if user has already requested the subgreddit
  const existingRequest = user.subgreddiits.find(
    (sub) => sub.subgreddiitId.toString() === subID.toString()
  );
  if (existingRequest) {
    return res
      .status(200)
      .json({ message: "User has already requested this subgreddit." });
  }
  
  // Add subgreddit to user's subgreddits list
  await User.updateOne(
    { _id: userId },
    {
      $addToSet: {
        subgreddiits: {
          status: "requested",
          subgreddiitId: subID,
          date: Date.now(),
        },
      },
    }
  );
  
  // Add user to subgreddit's user list
  await Subgrediit.updateOne(
    { _id: subID },
    {
      $addToSet: {
        users: {
          status: "requested",
          userId: userId,
          date: Date.now(),
        },
      },
    }
  );
  
  res.status(200).json({ message: "Successfully requested subgreddit." });
  } catch (error) {
  console.error(error);
  res.status(500).json({ message: "Server error." });
  }
  });

router.put("/leave/:subID", async (req, res) => {
  try {
  const { subID } = req.params;
  const  {userId}  = req.body;
  // Check if subgreddit exists
  const subgreddit = await Subgrediit.findById(subID);
  if (!subgreddit) {
    return res.status(404).json({ message: "Subgreddit not found." });
  }
  
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  // Update subgreddit status for user to "isBlocked"
  await User.updateOne(
    { _id: userId, "subgreddits.subgredditId": subID },
    { $set: { "subgreddits.$.status": "isBlocked" } }
  );
  
  // Update user status for subgreddit to "isBlocked"
  await Subgrediit.updateOne(
    { _id: subID, "users.userId": userId },
    { $set: { "users.$.status": "isBlocked" } }
  );
  
  res.status(200).json({ message: "Successfully left subgreddit." });
  } catch (error) {
  console.error(error);
  res.status(500).json({ message: "Server error." });
  }
  });

router.get('/:id', async (req, res) => {
  try {
    const {id}= req.params;
    
    // Needs to be fixed my routing is shitty so when user clears search bar
    // and hits enter, it goes into this get req with "search" as the id
    if(id === "search")
    {
      Subgrediit.find({}, function(err, subgreddiits) {
        if (err) {
          console.error(err);
        } else {
           res.status(200).json(subgreddiits)
        }
      });
    }
    else {
    const sub = await Subgrediit.findById(id);
    if (!sub) {
      console.log('line 40 :Subgreddiit not found')
      return res.status(404).json({ msg: 'Subgreddiit not found' });
    }
    res.status(200).json(sub);
  }
  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
export default router;