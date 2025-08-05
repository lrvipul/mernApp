const express = require('express');
const Notes = require("../models/Notes")
const fetchuser = require("../middleware/fetchuser")
const router = express.Router();
const { body, validationResult } = require('express-validator');


 // Route 1 : get AllNotes of LoggedIn User : get "/api/note/fetchallnotes". require auth
    router.get('/fetchallnotes',fetchuser,  async (req, res) =>  {

        try{            
            let userId = req.user.id;
            let notes = await Notes.find({user:userId});
            console.log("Notes = ",notes)
            let messageText = "Notes not found"
            if (notes.length > 0)
                messageText = "Found Result"

            res.status(200).json({ notes,  message: messageText });

        } catch(error){
            res.status(401).json({ message: 'Server error during user check.' })
        }
    })


// Route 2 : Add New Note : get "/api/note/addnote". require auth
    router.post('/addnote',fetchuser, [
        body('title')
        .notEmpty().withMessage("title cant be empty"),
        body('description',"Desctiption min lenght must be 5").isLength({ min: 5 })],  async (req, res) =>  {

        try{
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let userId = req.user.id;
            const {title,description,tag} = req.body;

            let notes = new Notes({title,description,tag,user:userId});

            savedNote = await notes.save();

            res.status(200).json({ savedNote,  message: "New Note added successfully." });

        } catch(error){
            
            res.status(401).json({ message: 'some eror occured while saving new Note.' })
        }
    })


    // Route 3 : Update existing Note : put "/api/note/updatenote". require auth
    router.put('/updatenote/:id',fetchuser, [
        body('title')
        .notEmpty().withMessage("title cant be empty"),
        body('description',"Desctiption min lenght must be 5").isLength({ min: 5 })],  async (req, res) =>  {

        try{
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let noteId = req.params.id;
            let note = await Notes.findById(noteId)
            if(!note)
                return res.status(404).json({message:"requested Notes is not found."})

            userId = req.user.id;
            if(userId != note.user)
                return res.status(401).json({message:"You are not authorized to update this Note. "})

            const {title,description,tag} = req.body;

            let noteChanges = {};
            if(title) { noteChanges.title = title }
            if(description) { noteChanges.description = description }
            if(tag) { noteChanges.tag = tag }

            updatedNote = await Notes.findByIdAndUpdate(noteId,{$set:noteChanges},{new:true})

            res.status(200).json({ updatedNote,  message: "Note Updated successfully." });

        } catch(error){
            res.status(401).json({ message: 'some eror occured while saving new Note.' })
        }
    })

    // Route 4 : Delete a Note : get "/api/note/deletenote". require auth
    router.delete('/deletenote/:id',fetchuser, async (req, res) =>  {

        try{
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let noteId = req.params.id;
            let note = await Notes.findById(noteId)

            if(!note)
                return res.status(404).json({message:"requested Notes is not found."})

            userId = req.user.id;
            if(userId != note.user)
                return res.status(401).json({message:"You are not authorized to update this Note. "})

            await Notes.findByIdAndDelete(noteId);

            res.status(200).json({ message: "Note Deleted successfully." });

        } catch(error){
            res.status(401).json({ message: 'some eror occured while saving new Note.' })
        }
    })

module.exports = router