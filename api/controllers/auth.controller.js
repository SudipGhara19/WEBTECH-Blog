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
        return next(errorHandler(400, 'All fields are required.'));
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
            {id: validUser._id, isAdmin: validUser.isAdmin},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
         );

         // sending token to the cookie and userdata with response
         res.status(200).cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
         }).json(rest);


    }catch(error){
        console.log(error);
        next(error);
    }
}


// ------------------------------signin with google------------------------

export const google = async (req, res, next) => {
    const {name, email, googlePhotoUrl} = req.body;

    try{
        const user = await User.findOne({email});

        if(user){
            // Generating jwt token
            const token = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
            );

            //hinding password before sending
            const {password, ...rest} = user._doc;
            // sending token to the cookie and userdata with response
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            }).json(rest);

        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            
            //creating new user
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });

            await newUser.save();
            // Generating jwt token
            const token = jwt.sign(
                {id: newUser._id, isAdmin: newUser.isAdmin},
                process.env.JWT_SECRET,
                {expiresIn: '1d'}
            );

            //hinding password before sending
            const {password, ...rest} = newUser._doc;
            // sending token to the cookie and userdata with response
            res.status(200).cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
            }).json(rest);

        }

    }catch(error){
        next(error);
    }
}