const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');



// Router 1 .Get All the Notes using: GET "/api/notes/fetchallnotes"  Login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user:req.user.id });
        res.json(notes)
    }

    catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Internal Server Error" });

    }
})

// Router 2 .Add a new Notes using: POST "/api/notes/Addnote"  Login required

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', ' Description must be atlest 5 charecters').isLength({ min: 5 }),
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user:req.user.id

        });
        const saveNote = await note.save();
        res.json(saveNote);


    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Internal Server Error" });

    }

})

module.exports = router