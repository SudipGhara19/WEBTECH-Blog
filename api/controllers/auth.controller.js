import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";


export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    const hashPassword = bcryptjs.hashSync(password, 10);

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        next(errorHandler(400, 'All fields are required.'))
    }

    const newUser = new User({
        username,
        email,
        password: hashPassword,
    })

    try{
        await newUser.save();
        return res.json("Signup successful.")
    }catch(err){
        next(err);
    }
}