import {OAuth2Client} from 'google-auth-library';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import User from '../models/mongoUsers.js';
const CLIENT_ID = '136594722692-lp6ui1591t2uf6f4vrmjbmtk1bfvbn8s.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const router = express.Router();
router.post('/', async (req, res) => {
  const token = req.body.tokenId;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const { email, sub } = ticket.getPayload();
    const user = await User.findOne({email});
    if (!user)
    {
        return res.status(400).json({message:"There is no account assosciated with this email"})
    }
    const token = user.genToken();
    res.sendStatus(200).json({token});
  } catch (error) {
    console.error(error);
    res.sendStatus(401).json({message: "Server Error"});
  }
})


export default router;