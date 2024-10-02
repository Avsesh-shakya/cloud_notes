const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');



const JWT_SCREAT = 'avsesh00$boy';

// Create a user using: POST "/api/auth/createuser"  Do not require Auth
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email Address').isEmail(),
    body('password', 'Password must be at least 5 characters and at most 10 characters').isLength({ min: 5, max: 10 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }
    
    try {
        // Check if the user with the same email exists
        let user = await User.findOne({ email: req.body.email});
        if (user) {
            return res.status(400).json({ error: "Sorry, a user with this email already exists" });
        }
            // Add salt using bcryptjs
        const salt =  await bcrypt.genSalt(10);
        const SecPass = await bcrypt.hash(req.body.password,salt);

        // Create a new user
         user = await User.create({
            name: req.body.name,
            password: SecPass,
            email: req.body.email,
        });
        const data={
            user:{
                id:user.id 
            }
        }
        const authtoken = jwt.sign(data, JWT_SCREAT);
        console.log(authtoken)
        // res.json(authtoken)
        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
