import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';


dotenv.config();
const port = 3000;
const app = express();

//connecting to mongodb database
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(`Connected to MongoDB:::::::`)
    })
    .catch((err) => {
        console.log(`Error in connecting MongoDB:::::: ${err}`)
    })


app.listen(port, () => {
    console.log(`Server is up and running on PORT::::${port}!!`)
});


//----------------------------------Routes--------------------------------------

app.use('/user', userRouter);
