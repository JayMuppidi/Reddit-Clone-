import mongoose from "mongoose";
const { Schema } = mongoose;

const SubgrediitSchema = new Schema({
  name: { type: String, required: true  },
  description: { type: String, required: true  },
  // image: { type: String },
  moderatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dateCreated: { type: Date, default: Date.now },
  tags: [{ type: String }],
  imgUrl: {type:String},
  bannedWords: [{ type: String }],
  users: [{
    status: { type: String, enum: ['member', 'isBlocked', 'requested','moderator'], default: 'requested' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date }
  }],
  posts: [{
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['visible', 'deleted', 'reportedOnce'], default: 'visible' }// kinda fucked up visible = neverReported it doesn't actually mean visible
  }],
  reports: [{
    reportId: { type: Schema.Types.ObjectId, ref: 'Report' },
  }]
});

const Subgrediit = mongoose.model('Subgreddiit', SubgrediitSchema);

export default Subgrediit;