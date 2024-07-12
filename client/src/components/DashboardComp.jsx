import { useEffect, useState } from "react"
import {useSelector} from 'react-redux';
import {HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup} from 'react-icons/hi';
import {Button, Table} from 'flowbite-react';
import {Link} from 'react-router-dom';

export default function DashboardComp(){
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    const {currentUser} = useSelector((state) => state.user);

    useEffect(() => {
        // Fetching the Users 
        const fetchUsers = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/user/getUsers?limit=5`,{
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });

            const data = await res.json();
            if(res.ok){
                setUsers(data.users);
                setTotalUsers(data.totalUsers);
                setLastMonthUsers(data.lastMonthUsers);
            }
        }

        //Fetching the Posts
        const fetchPosts = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/post/getPosts?limit=5`,{
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });
            const data = await res.json();

            if(res.ok){
                setPosts(data.posts);
                setTotalPosts(data.totalPosts);
                setLastMonthPosts(data.lastMonthPosts)
            }
        }
        //Fetching the Comments
        const fetchComments = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/comment/getComments?limit=5`,{
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });

            const data = await res.json();

            if(res.ok){
                setComments(data.comments);
                setTotalComments(data.totalComments);
                setLastMonthComments(data.lastMonthComments);
            }
        }

        // If the CurrentUser is ADMIN then fetching all the POSTS, USERS & COOMENTS
        if(currentUser.isAdmin){
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser])


    return(
        <div className="p-3 mx-auto">
            <div className="flex-wrap flex gap-4 justify-center">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap 4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between ">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-500 text-white rounded-full text-5xl p-3 shadow-lg"/>
                        
                    </div>
                    <div className="flex gap-2 text-sm ">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp/>
                            {lastMonthUsers}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>

                <div className="flex flex-col p-3 dark:bg-slate-800 gap 4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between ">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiDocumentText className="bg-lime-500 text-white rounded-full text-5xl p-3 shadow-lg"/>
                        
                    </div>
                    <div className="flex gap-2 text-sm ">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp/>
                            {lastMonthPosts}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>

                <div className="flex flex-col p-3 dark:bg-slate-800 gap 4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between ">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
                        
                    </div>
                    <div className="flex gap-2 text-sm ">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp/>
                            {lastMonthComments}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center mx-auto gap-4 py-3">
                {/* Users Table */}
                <div className="flex flex-col w-full md:w-auto shadow-md dark:bg-gray-800 p-2 rounded-md mt-4">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1>Recent users</h1>
                        <Button className="" outline gradientDuoTone='purpleToBlue'>
                            <Link to='/dashboard?tab=users'>See all</Link>
                        </Button>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {users && users.map((user) => (
                            <Table.Body key={user._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        <img
                                            alt='user-image'
                                            src={user.profilePicture}
                                            className="w-10 h-10 rounded-full bg-gray-500"/>
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                
                {/* comments table */}
                <div className="flex flex-col w-full md:w-auto shadow-md dark:bg-gray-800 p-2 rounded-md mt-4">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1>Recent comments</h1>
                        <Button className="" outline gradientDuoTone='purpleToBlue'>
                            <Link to='/dashboard?tab=comments'>See all</Link>
                        </Button>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Likes </Table.HeadCell>
                        </Table.Head>
                        {comments && comments.map((comment) => (
                            <Table.Body key={comment._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="w-96">
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </Table.Cell>
                                    <Table.Cell>{comment.numOfLikes}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                
                {/* posts table */}
                <div className="flex flex-col w-full md:w-auto shadow-md dark:bg-gray-800 p-2 rounded-md mt-4">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1>Recent posts</h1>
                        <Button className="" outline gradientDuoTone='purpleToBlue'>
                            <Link to='/dashboard?tab=posts'>See all</Link>
                        </Button>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        {posts && posts.map((post) => (
                            <Table.Body key={post._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        <img
                                            alt='user-image'
                                            src={post.image}
                                            className="w-10 h-10 rounded-full bg-gray-500"/>
                                    </Table.Cell>
                                    <Table.Cell className="w-96">
                                        <p className="line-clamp-2">{post.title}</p>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    )
}