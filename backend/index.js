import express from 'express'
import connectDB from './utils/connectDB.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import gAuthRoutes from './routes/gAuth.js'
import gredditRoutes from './routes/subgrediit.js'
import postRoutes from './routes/post.js'
import commentRoutes from './routes/comments.js'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors());

connectDB()




app.use('/api/user',userRoutes)
app.use('/api/post',postRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/comments',commentRoutes)
app.use('/api/greddits',gredditRoutes)
app.use('/api/gAuth',gAuthRoutes)
app.get('/',(req,res) => {
    res.send('Hello World')
});

const PORT = process.env.port|| 8000;

app.listen( PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})