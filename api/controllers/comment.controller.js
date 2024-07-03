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


//---------------------------------Edit comment API ------------------------------
export const editComment = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404, 'Comment not found.'));
        }

        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(403, 'You are not allowed to edit this comment.'))
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content
        },{
            new: true
        });

        res.status(200).json(editComment);

    }catch(error){
        console.log(error);
        next(error);
    }
}

//--------------------------------- Delete Comment API ---------------------------
export const deleteComment = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404, 'Comment not found.'))
        };

        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(403, 'You are not allowed to delete this comment.'));
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Comment has been deleted.');

    }catch(error){
        console.log(error)
        next(error);
    }
}