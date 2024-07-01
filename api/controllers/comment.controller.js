import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

//------------------------------------- Adding a Comment-------------------------------------
export const createComment = async (req, res, next) => {
    try{
        const {content, postId, userId} = req.body;

        if(userId !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to create a comment.'))
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        });

        await newComment.save();
        res.status(200).json(newComment);
    }catch(error){
        console.log(error);
        next(error);
    }
}


//------------------------------------- Get post's comments-----------------------------------
export const getPostComments = async (req, res, next) => {
    try{
        const postId = req.params.postId;
        const comments = await Comment.find({postId}).sort({creatdAt: -1});
        res.status(201).json(comments);
    }catch(error){
        console.log(error);
        next(error)
    }
}

//-----------------------------------Toggle Like API ----------------------------------
export const toggleLike = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(403, 'Comment not found.'));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.numOfLikes += 1;
            comment.likes.push(req.user.id);

        }else{
            comment.numOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }

        await comment.save();
        res.status(200).json(comment);

    }catch(error){
        console.log(error);
        next(error)
    }
}