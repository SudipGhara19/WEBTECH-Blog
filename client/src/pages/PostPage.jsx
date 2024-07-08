import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import CallToAction from "../components/CalltoAction.jsx";
import CommentSection from "../components/CommentSection.jsx";
import PostCard from "../components/PostCard.jsx";


export default function PostPage() {
    const {postSlug} = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [recentPosts, setRecentPosts] = useState([]);
    

    // fetching the post via post-slug 
    useEffect(() => {

        const fetchPost = async () => {
            try{
                setLoading(true);
                const res = await fetch(`${process.env.REACT_APP_BACKEND}api/post/getposts?slug=${postSlug}`,{
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });

                const data = await res.json();
                if(!res.ok){
                    console.log(data.message);
                    setError(true);
                    setLoading(false);
                    return;
                }
                if(res.ok){
                    setLoading(false);
                    setError(false);
                    setPost(data.posts[0]);
                }
            }catch(error){
                setError(true);
                setLoading(false);
                console.log(error);
            }
        };

        fetchPost();
    }, [postSlug]);

    //fetching recent posts
    useEffect(() => {
        try{
            const fetchRecentPosts = async () => {
                const res = await fetch(`${process.env.REACT_APP_BACKEND}api/post/getposts?limit=3`,{
                    method: 'GET',
                    headers: {'Content-Type':'application/json'},
                });

                const data = await res.json();
                if(res.ok){
                    setRecentPosts(data.posts);
                }
            }
            fetchRecentPosts();
        }catch(error){
            console.log(error);
        }
    }, [])

    // set spinner
    if(loading){
        return(
            <div className="flex justify-center items-center mx-auto min-h-screen">
                <Spinner size='xl' />
            </div>
        )
    };



    return(
        <main className="p-3 flex  flex-col items-center mx-auto max-w-6xl min-h-screen">
            <h1 className="text-3xl sm:text-4xl text-center mt-10 mx-auto max-w-2xl">{post && post.title}</h1>
            <Link className="mt-5" to={`/search?category=${post && post.category}`} >
                <Button color='gray' pill size='xs'>{post && post.category}</Button>
            </Link>
            <img src={post && post.image} alt={post && post.title} className="max-h-[500px] w-full object-cover p-3 mt-10" />
            <div className="flex justify-between p-3 border-b border-slate-500 max-auto w-full max-w-2xl text-xs">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="italic ">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div
                className='text-center p-3 max-w-2xl mx-auto w-full post-content'
                dangerouslySetInnerHTML={{__html: post && post.content}}
            >

            </div>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction/>
            </div>
            <CommentSection postId={post._id}/>

            <div className="flex flex-col justify-center items-center mb-5">
                <h1 className="text-xl mt-5">Recent articles</h1>
                <div className="flex flex-wrap justify-center items-center mt-5 gap-5">
                    {
                        recentPosts && 
                        recentPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                </div>
            </div>
        </main>
    )
}