import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';


dotenv.config();
const port = 5001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//connecting to mongodb database
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(`Connected to MongoDB:::::::`)
    })
    .catch((err) => {
        console.log(`Error in connecting MongoDB:::::: ${err}`)
    })


app.listen(port, () => {
    console.log(`Server is up and running on PORT ---> http://localhost:${port}`)
});


//----------------------------------Routes--------------------------------------

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);




//-------------------------------Error Handler--------------------------------------

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error.';

    res.json({
        success: false,
        statusCode,
        message
    });
})