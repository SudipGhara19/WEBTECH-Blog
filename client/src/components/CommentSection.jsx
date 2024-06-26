import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';

export default function CommentSection({postId}){
    const {currentUser} = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(comment.length > 200){
            setCommentError('Comment must be between 200 words');
            return;
        }

        try{
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/comment/create`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            });

            const data = await res.json();
            if(!res.ok){
                setCommentError(data.message);
                return;
            }
            if(res.ok){
                setCommentError(null);
                setComment('');

            }
        }catch(err){
            console.log(err);
            setCommentError(err.message);
        }
        
    };

    return(
        <div className='max-w-2xl mx-auto p-3 w-full'>
            { currentUser ? 
            (
                <div className='flex items-center gap-1 my-7 text-gray-500'>
                    <p>Signed in as:</p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt='user-image' />
                    <Link className='text-cyan-600 hover:underline' to='/dashboard?tab=profile' >@{currentUser.username}</Link>
                </div>
            )
            :
            (
                <div className='text-sm'>
                    You must be signed in to comment.
                    <Link to='/signin' className='text-cyan-600'>Sign In</Link>
                </div>
            )
        }

        {currentUser && (
            <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                <Textarea
                placeholder='Add a comment...'
                rows='3'
                maxLength='200'
                onChange={(e) => setComment(e.target.value)}
                value={comment}     />
                <div className='flex justify-between mt-5'>
                    <p className='text-gray-400'>{200 - comment.length} character remaining</p>
                    <Button type='submit'
                            outline
                            gradientDuoTone='purpleToBlue'>
                        Submit
                    </Button>
                </div>
                {commentError && <Alert className='mt-3' color='failure'>{commentError}</Alert>}
            </form>

            
        )}
        </div>
    )
}