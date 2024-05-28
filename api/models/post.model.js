import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId:{
            type: String,
            required: true,
        },
        content:{
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true,
            unique: true
        },
        image:{
            type: String,
            default: 'https://www.elegantthemes.com/blog/wp-content/uploads/2019/08/things-successful-blogs-have-in-common-featured-image.jpg'
        },
        category:{
            type: String,
            default: 'uncategorized'
        },
        slug:{
            type: String,
            required: true,
            unique: true
        }
    }, {timestamps: true}
);

const Post = mongoose.Model('Post', postSchema);
export default Post;