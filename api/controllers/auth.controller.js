import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';


export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    const hashPassword = bcryptjs.hashSync(password, 10);

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        return res.status(400).json({message: 'All fields are required.'});
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
        return res.status(500).json({message: err.message})
    }
}