import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
// import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

//------------------------sign-up controller----------------------------
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        return next(errorHandler(400, 'All fields are required.'))
    }
    //hashing the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try{
        // save to mongoDB
        await newUser.save();
        return res.json("Signup successful.")
    }catch(err){
        next(err);
    }
}

// ------------------------------sign in controller----------------------------------
export const signin = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password || email === '' || email === ''){
        next(errorHandler(400, 'All fields are required.'));
    }

    try{
        // checking user has a account or not by email
         const validUser = await User.findOne({email});
         if(!validUser){
            return next(errorHandler(400, 'User not found.'))
         }
         // checking the password
         const validPassword = bcrypt.compareSync(password, validUser.password);
         if(!validPassword){
            return next(errorHandler(400, 'Invaild password.'))
         }

         //hinding password before sending
         const {password: pass, ...rest} = validUser._doc;

         // Generating jwt token
         const token = jwt.sign(
            {id: validUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
         );

         // sending token to the cookie and userdata with response
         res.status(200).cookie('access_token', token, {
            httpOnly: true,
         }).json(rest);


    }catch(error){
        console.log(error);
        next(error);
    }
}