import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {useSelector} from 'react-redux';
import { Link } from "react-router-dom";

export default function DashPosts(){
    const {currentUser} = useSelector((state) => state.user);
    const [showMore, setShowMore] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/post/getposts?userId=${currentUser._id}`,{
                method: 'GET'
            });
            const data = await res.json();

            if(res.ok){
                setUserPosts(data.posts);
            };
            if(data.posts.length < 9){
                setShowMore(false);
            }
        }
        if(currentUser.isAdmin){
            fetchPosts();
        }
    }, [currentUser._id]);


    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try{
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`,{
                method: 'GET'
            });
            const data = await res.json();
            if(res.ok){
                setUserPosts((prev) => [...prev, ...data.posts]);
                if(data.posts.length < 9){
                    setShowMore(false);
                }
            }

        }catch(error){
            console.log(error)
        }
    }


    const handleDeletePost = async () => {
        setShowModal(false);
        try{

            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/post/deletepost/${currentUser._id}/${postIdToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {"content-Type" : "application/json"},
            });

            const data = await res.json();

            if(!res.ok){
                console.log(data.message);
            } else {
                setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
            }

        }catch(error){
            console.log(error.message);
        }
    }

    return(
        <div className='h-screen table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {userPosts.map((post) => (
                            <Table.Body className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                        <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500"/>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                                        <Link to={`/post/${post.slug}`}>{post.title}</Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <span className="text-red-500 hover:underline cursor-pointer" 
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setPostIdToDelete(post._id);
                                                }}
                                                >
                                            Delete
                                            </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                                            <span>Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (<Button className="mx-auto my-3" onClick={handleShowMore}>
                        Show more
                    </Button>)}
                </>
            )  :  (
                <p>You have no posts yet!</p>
            )}

<Modal show={showModal} 
                    onClose={() => setShowModal(false)}
                    popup
                    size='md'
                >
                    <div className='text-center'>
                    <Modal.Header/>
                    <Modal.Body>
                        <HiOutlineExclamationCircle className='h-14 w-14 mx-auto mb-4 text-gray-500 dark:text-gray-300' />
                        <h3 className='mb-3 text-gray-700 text-center text-lg'>Are you sure you want to delete this post?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeletePost}>Yes, I am sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </Modal.Body>
                    </div>
            </Modal>
        </div>
    )
}