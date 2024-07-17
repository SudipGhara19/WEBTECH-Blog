import { useEffect, useState } from "react"
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from "react-redux";
import { Button, Modal, Textarea } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Comments({ comment, onLike, onEdit, onDelete }){

    const [user, setUser] = useState({});
    const {currentUser} = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try{
                const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/user/getUser/${comment.userId}`,{
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
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/comment/editComment/${comment._id}`, {
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

    const handleDelete = async () => {
        setShowModal(false);

        try{
            if(!currentUser){
                navigate('/signin');
                return;
            }

            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/comment/deleteComment/${comment._id}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });

            if(res.ok){
                onDelete(comment);
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

                                {
                                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                        <button className="text-sm text-gray-500"
                                                onClick={()=>setShowModal(true)}>
                                            Delete
                                        </button>
                                    )
                                }
                                <Modal show={showModal} 
                                    onClose={() => setShowModal(false)}
                                    popup
                                    size='md'
                                    >
                                    <div className='text-center'>
                                    <Modal.Header/>
                                    <Modal.Body>
                                        <HiOutlineExclamationCircle 
                                            className='h-14 w-14 mx-auto mb-4 text-gray-500 dark:text-gray-300' 
                                            />
                                        <h3 className='mb-3 text-gray-700 text-center text-lg'>
                                            Are you sure you want to delete this comment?
                                        </h3>
                                        <div className='flex justify-center gap-4'>
                                            <Button color='failure' onClick={handleDelete}>Yes, I am sure</Button>
                                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                                        </div>
                                    </Modal.Body>
                                    </div>
                                </Modal>
                            </div>
                    </>)
                }
                
            </div>
        </div>
    )
}