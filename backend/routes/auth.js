import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/mongoUsers.js';

const router = express.Router();


router.post('/signup', [
  body('fName').not().isEmpty().withMessage('First name is required'),
  body('lName').not().isEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('uName').not().isEmpty().withMessage('User name is required'),
  body('age').isInt({ min: 14 }).withMessage('You must be older than 14'),
  body('phoneNo').not().isEmpty().withMessage('You need to enter a phone number ').isMobilePhone().withMessage('Invalid contact number format'),
  body('pword').isLength({ min: 1 }).withMessage('Password is required')
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fName, lName, email, uName, age, phoneNo, pword } = req.body;

    try {
      let user = await User.findOne({ uName });
      if (user) {
        return res.status(401).json({ errors: [{ msg: 'Someone else has this username' }] });
      }

      user = new User({ fName, lName, email, uName, age, phoneNo, pword });

      const salt = await bcrypt.genSalt();
      user.pword = await bcrypt.hash(pword, salt);

      await user.save();
      const token = user.genToken();
      res.status(201).json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.post('/login', [
  body('uName').not().isEmpty().withMessage('User name is required').trim().escape(),
  body('pword').isLength({ min: 1 }).withMessage('Password is required')
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uName, pword } = req.body;
    

    try {
      const user = await User.findOne({ uName });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const isMatch = await user.checkPassword(pword);
      
      if (!isMatch) {
        console.log(isMatch);
        return res.status(401).json({ message: "Invalid creds" });
      }
      const token = user.genToken();
      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }

)



export default router;