import {Link} from 'react-router-dom';
import CallToAction from '../components/CalltoAction.jsx';
import PostCard from '../components/PostCard.jsx';
import { useEffect, useState } from 'react';

export default function Home(){
    const [posts, setPosts] = useState([]);

    // fetching the posts for home page to show recent posts
    useEffect(() => {
        try{
            const fetchPosts = async () => {
                const res = await fetch(`${process.env.REACT_APP_BACKEND}api/post/getPosts`,{
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });

                const data = await res.json();
                if(res.ok){
                    setPosts(data.posts);
                };
            };

            fetchPosts();
        }catch(err){
            console.log(err);
        }
    },[]);
    return(
        <div>
            <div className="flex flex-col p-24 px-4 mx-auto max-w-6xl gap-6">
                <h1 className="text-3xl lg:taxt-6xl">Welcome to <b>WEBtech-Blogs</b></h1>
                <p className="text-xs sm:text-sm text-gray-500">Here you'll find a variety of articles and posts on topics such as web development, software engineering and programming languages.</p>
                <Link to='/search' className="text-teal-500 hover:underline text-sm">
                    View all posts
                </Link>
            </div>
            <div className='p-3 bg-amber-100 dark:bg-slate-700'>
                <CallToAction/>
            </div>
            <div>
                <div className='flex flex-col p-3 max-w-6xl font-semibold mx-auto gap-8 py-7'>
                    { posts && posts.length > 0 && (
                        <div className='flex flex-col gap-6 '>
                            <h2 className='font-semibold text-2xl text-center'>Recent Posts</h2>
                            <div className='flex flex-wrap gap-8 justify-center'>
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post}/>
                                ))}
                            </div>
                            
                            <Link to='/search' className='text-center text-teal-500 hover:underline'>
                                See all posts
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}