import mongoose from "mongoose";

const { Schema } = mongoose;

const ReportSchema = new Schema({
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true  },
  reporteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true  },
  concern: { type: String, required: true },
  subgreddiitId: { type: Schema.Types.ObjectId, ref: 'Subgreddiit', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['blocked', 'deleted', 'ignored','Neutral'], required: true, default: 'Neutral' }
});

const Report = mongoose.model('Report', ReportSchema);

export default Report;