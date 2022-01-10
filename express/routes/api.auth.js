const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const schemas = require('../schemas/schemas');
const Router = require('express');
const router = new Router();

async function findOne(obj) { 
    try {
        let result = await schemas.userModel.findOne(obj); //findOne un users collection
        return result;
    } catch (error) {
        return error;
    }
}

async function insertOne(obj) {
    try {
        let User = new schemas.userModel(obj); //insertOne in user collection
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
        check('username', 'Incorrect username.').isLength({ min: 3 }), //middleware checks
        check('password', 'Incorrect password.').isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
  
        if (!errors.isEmpty()) {
            return res.status(400).json({
            errors: errors.array(),
            message: 'Incorrect data in registration'
            })
        }
  
        const {username, password, email} = req.body;
  
        const candidate = await findOne({username});
  
        if (candidate) {
            return res.status(400).json({ message: 'User already exist.' });
        }

        // if user is new we can insert him to database
  
        const hashedPassword = await bcrypt.hash(password, 12);
        await insertOne({ email, username, password: hashedPassword });
  
        res.status(201).json({ message: 'User created.' });
  
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Something went wrong.' });
    }
  })

// /api/auth/login
router.post(
    '/login', 
    [
        check('username', 'Username is missing.').exists(), //middleware checks
        check('password', 'Password is missing.').exists(),
        check('expiresIn', 'Expiration data is missing.').exists(),
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
            return res.status(400).json({message: "User does not exist."});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({message: "Incorrect password."});
        }

        const token = jwt.sign(
            {userId: user._id, username: user.username}, 
            config.get("jwtSecret"), 
            {expiresIn: req.body.expiresIn}
        ); // json web token sign, based on username and userId, so if user tries to change it, he will be logged out.

        return res.json({ token, userId: user._id, username: user.username});
})

// /api/auth/check
router.post(
    '/check', 
    async(req, res)=>{ // necessary method to check, if json web token is corrent and nothing has been changed.
        jwt.verify(req.body.token, config.get("jwtSecret"), (err, decoded)=>{
            if(!err) {
                return res.json(decoded.userId == req.body.userId && decoded.username == req.body.username); 
            } else {
                return res.json(false);
            }
        });
    }    
)


module.exports = router;