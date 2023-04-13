import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema({
  text: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subgreddiitId: { type: Schema.Types.ObjectId, ref: 'Subgreddiit', required: true },
  upvotes: { type: Number, required: true, default: 0 },
  downvotes: { type: Number, required: true, default: 0 },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['neverRep', 'deleted', 'reportedOnce'], required: true, default: 'neverRep' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Post = mongoose.model('Post', PostSchema);

export default Post;