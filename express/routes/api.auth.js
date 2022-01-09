const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const schemas = require('../schemas/schemas');
const mongoose = require('mongoose');

const Router = require('express');
const router = new Router();

async function findOne(obj) {
    try {
        let result = await schemas.userModel.findOne(obj);
        return result;
    } catch (error) {
        return error;
    }
}

async function insertOne(obj) {
    try {
        let User = new schemas.userModel(obj)
        let result = User.save();
        return result;
    } catch (error) {
        return error;
    }
}

// /api/auth/register
router.post(
    '/register',
    [
        check('username', 'Incorrect username.').isLength({ min: 3 }),
        check('password', 'Incorrect password.').isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
  
        if (!errors.isEmpty()) {
            return res.status(400).json({
            errors: errors.array(),
            message: 'Incorrect data in registration'
            })
        }
  
        const {username, password, email} = req.body
  
        const candidate = await findOne({username})
  
        if (candidate) {
            return res.status(400).json({ message: 'User already exist.' })
        }
  
        const hashedPassword = await bcrypt.hash(password, 12)
        await insertOne({ email, username, password: hashedPassword });
  
        res.status(201).json({ message: 'User created.' })
  
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Something went wrong.' })
    }
  })

// /api/auth/login
router.post(
    '/login', 
    [
        check('username', 'Username is missing.').exists(),
        check('password', 'Password is missing.').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Authentication failed."
            });
        }

        const {username, password} = req.body;

        const user = await findOne({username});

        if(!user) {
            return res.status(400).json({message: "Authentication failed."});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({message: "Authentication failed."});
        }

        const token = jwt.sign(
            {userId: user._id}, 
            config.get("jwtSecret"), 
            {expiresIn: '1h'}
        );

        return res.json({ token, userId: user._id, username: user.username});
})

// /api/auth/check
router.post(
    '/check', 
    async(req, res)=>{
        const result = jwt.verify(req.body.token, config.get("jwtSecret"), (err, decoded)=>{
            if(!err) {
                return res.json(decoded.userId == req.body.userId);
            } else {
                return res.json(false);
            }
        });
    }    
)


module.exports = router;