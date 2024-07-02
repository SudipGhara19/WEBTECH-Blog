import { useEffect, useState } from "react"
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comments({ comment, onLike, onEdit }){

    const [user, setUser] = useState({});
    const {currentUser} = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

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

    const handleEdit = async () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try{
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    content: editedContent
                })
            });

            if(res.ok){
                setIsEditing(false);
                onEdit(comment, editedContent);
            }

        }catch(error){
            console.log(error);
        }
    }


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
                {
                    isEditing ? (
                        <>
                            <Textarea 
                            className="mb-2"
                            value={editedContent}
                            onChange={(e)=>setEditedContent(e.target.value)}/>
                            <div className="flex justify-end gap-2">
                                <Button type="button" gradientDuoTone='purpleToBlue' size='sm' onClick={handleSave}>
                                    Save
                                </Button>
                                <Button type="button" outline gradientDuoTone='purpleToBlue' size='sm' onClick={()=>setIsEditing(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : 
                    (<>
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
                                {
                                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                        <button className="text-sm text-gray-500"
                                                onClick={handleEdit}>
                                            Edit
                                        </button>
                                    )
                                }
                            </div>
                    </>)
                }
                
            </div>
        </div>
    )
}