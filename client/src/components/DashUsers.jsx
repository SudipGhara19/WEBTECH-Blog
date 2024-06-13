import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {useSelector} from 'react-redux';
import { Link } from "react-router-dom";

export default function DashUsers(){
    const {currentUser} = useSelector((state) => state.user);
    const [showMore, setShowMore] = useState(true);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/user/getusers`,{
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type' : 'application/json'}
            });
            const data = await res.json();

            if(res.ok){
                setUsers(data.users);
            };
            if(data.users.length < 9){
                setShowMore(false);
            }
        }
        if(currentUser.isAdmin){
            fetchUsers();
        }
    }, [currentUser._id]);


    const handleShowMore = async () => {
        const startIndex = users.length;
        try{
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/user/getusers?startIndex=${startIndex}`,{
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type' : 'application/json'}
            });
            const data = await res.json();
            if(res.ok){
                setUsers((prev) => [...prev, ...data.users]);
                if(data.users.length < 9){
                    setShowMore(false);
                }
            }

        }catch(error){
            console.log(error)
        }
    }


    const handleDeleteUser = async () => {

    }


    return(
        <div className='h-screen table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((user) => (
                            <Table.Body className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        
                                        <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover rounded-full"/>
                                        
                                    </Table.Cell>
                                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                                        <Link>{user.username}</Link>
                                    </Table.Cell>
                                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                                        {user.email}
                                    </Table.Cell>
                                    <Table.Cell>{user.isAdmin? 'admin' : 'user'}</Table.Cell>
                                    <Table.Cell>
                                        <span className="text-red-500 hover:underline cursor-pointer" 
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setUserIdToDelete(user._id)
                                                }}
                                                >
                                            Delete
                                            </span>
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
                <p>No users to show !</p>
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
                        <h3 className='mb-3 text-gray-700 text-center text-lg'>Are you sure you want to delete this user?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes, I am sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </Modal.Body>
                    </div>
            </Modal>
        </div>
    )
}