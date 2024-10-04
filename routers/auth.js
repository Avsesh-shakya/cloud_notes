const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchuser')



const JWT_SCREAT = 'avsesh00$boy';

// Router 1. Create a user using: POST "/api/auth/createuser"  Do not require Auth
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
        res.json({authtoken})
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// Router 2 .Authenticate a user using: POST "/api/auth/login"  Do not require Auth

router.post('/login', [

    body('email', 'Enter a valid Email Address').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }

    const {email,password}=req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"plz try to login with correct credentials"})
        }        

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"plz try to login with correct credentials"})

        }
        const payload ={
            user:{
                id:user.id 
            }
        }
        const authtoken = jwt.sign(payload, JWT_SCREAT);
        res.json({authtoken})
       
        


    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Internal Server Error" });
    
        
    }



})

// Router 3 .Get loggedin user detail using: POST "/api/auth/getuser"  Login required


router.post('/getuser',fetchuser, async (req, res) => {
try {
    userId= req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
    
} 
    catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Internal Server Error" });
    
    
}
})


module.exports = router;
