import mongoose from 'mongoose';
//import dotenv from 'dotenv';
//MONGO_URI=
//dotenv.config();

export default function connectDB () {
  mongoose.connect("mongodb+srv://destrier26:Jaikar234@dass.hsyheax.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    })
    .catch((err) => {
      console.error(`Error in connecting to MongoDB: ${err.message}`);
      process.exit(1);
    });
}