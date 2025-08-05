const express = require('express');
const User = require("../models/User")
const bcrypt = require('bcryptjs');
const fetchuser = require("../middleware/fetchuser")

var jwt = require('jsonwebtoken');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const JWT_SECRET = 'HarHarMahadev$Hail'


// Route 1 : Create a User using : POST "/api/auth/createuser". Does not require auth
router.post('/createUser',[
    body('name',"Enter a valid name").isLength({ min: 3 }),
    body('email',"Enter a valid Email").isEmail(),
    body('password').isLength({ min: 5 })],
    async function (req, res, next) {

        try{            
            // Validate User fields 
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // check if user exists in database or not
            let user = await User.findOne({ email: req.body.email });

            // if user with email exists, show error message
            if(user)
                return res.status(409).json({ message: `User with Email ID "${user.email}" already exists.` });


            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password,salt);

            // create new User
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })
            
            // not needed in async-await function
            /* .then(user => res.json(user))
            .catch(err => { console.log(errors)
                            res.json({error:"Please enter a unique Email ID", message:err.message}) 
                            }) */

            // const user = User(req.body);
            /*  user.save();
            console.log(req.body) 
            res.send(req.body) */

            const data = {
                user:{
                    id:user.id
                }
            }
            const authToken =  jwt.sign(data,JWT_SECRET)
            console.log(authToken)


            return res.status(200).json({ authToken, message: `User created successfully!.` });
            // return res.status(200).json({ message: `User created successfully!.` });

        } catch(error){
            console.error('Error checking user existence:', error);
            return res.status(500).json({ message: 'Server error during user check.' })
        }
    })


    // Route 2 :  User Login : POST "/api/auth/login". Does not require auth
    router.post('/login',[
    body('email')
        .isEmail().withMessage('Enter a valid email')
        .exists().withMessage('EmailId cant be blank'),
    body('password')
        .exists().withMessage("Password should not be empty")
        .notEmpty().withMessage("Password should not be empty")
    ],
    async function (req, res, next) {

        try{            
            // Validate User fields 
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const{email,password} = req.body;

            // check if user exists in database or not
            let user = await User.findOne({ email });

            // if user does nto exists then show error message
            if(!user)
                return res.status(400).json({ message: "Please try with the correct credentials again!" });

            const comparePass = await bcrypt.compare(password, user.password);

            if(!comparePass)
                return res.status(400).json({ message: "Please try with the correct credentials again!" });
    
            const data = {
                user:{
                    id:user.id
                }
            }
            const authToken =  jwt.sign(data,JWT_SECRET)

            return res.status(200).json({ authToken, message: `User LoggedIn successfully!.` });

        } catch(error){
            console.error('Error checking user existence:', error);
            return res.status(500).json({ message: 'Server error during user check.' })
        }
    })


    // Route 3 : get LoggedIn User Details : POST "/api/auth/getUser". require auth
    router.post('/getuser',fetchuser,  async (req, res) =>  {

        try{            
  
            let userId = req.user.id;

            const user = await User.findById(userId).select("-password");
            
            return res.status(200).json({ user,  message: `User details!.` });

        } catch(error){
            console.error('Error checking user existence:', error);
            return res.status(500).json({ message: 'Server error during user check.' })
        }
    })

    module.exports = router