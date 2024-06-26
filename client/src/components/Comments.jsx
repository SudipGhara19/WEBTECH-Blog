import { useEffect, useState } from "react"
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from "react-redux";

export default function Comments({ comment, onLike }){

    const [user, setUser] = useState({});
    const {currentUser} = useSelector((state) => state.user);

    useEffect(() => {
        const getUser = async () => {
            try{
                const res = await fetch(`${process.env.REACT_APP_BACKEND}api/user/getUser/${comment.userId}`,{
                    method: 'GET',
                    headers: {'Content-Type' : 'application/json'},
                });
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            }catch(error){
                console.log(error);
            }
        }
        getUser();
    }, [comment]);


    return(
        <div className="flex p-4 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3 ">
                <img className="h-10 w-10 rounded-full object-cover" src={user.profilePicture} alt={user.username} />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username}` : `anonymous`}</span>
                    <span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
                </div>
                <p className="text-gray-500 mb-2">{comment.content}</p>
                <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                    <button type="button" onClick={()=>onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${
                        currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                    }`}>
                        <FaThumbsUp className="text-sm" />
                    </button>
                    <p className="text-sm text-gray-500">
                        {comment.numOfLikes > 0 && comment.numOfLikes + ' ' + (comment.numOfLikes === 1 ? 'like' : 'likes')}
                    </p>
                </div>
            </div>
        </div>
    )
}