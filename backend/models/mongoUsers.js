import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { Schema } = mongoose;


const userSchema = new mongoose.Schema({
  fName: { type: String, required: true, trim: true},
  lName: { type: String, required: true , trim: true},
  email: { type: String, required: true , trim: true},
  uName: { type: String, unique: true, trim: true, required: true },
  age: { type: Number, required: true , trim: true},
  phoneNo: { type: String, required: true , trim: true},
  pword: { type: String, required: true , trim: true},
  savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  subgreddiits: [{
    status: { type: String, enum: ['joined', 'isBlocked', 'requested','moderator'] },
    subgreddiitId: { type: Schema.Types.ObjectId, ref: 'Subgreddiit' },
    date: { type: Date }
  }],
});

userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.pword);
  };
  
  userSchema.methods.genToken = function () {
    return jwt.sign({ user: { id: this._id } }, "admin", {
      expiresIn: "365d",
    });
  };

const User = mongoose.model("User", userSchema);

export default User;