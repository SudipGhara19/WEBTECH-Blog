import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {SpinnerDotted} from 'spinners-react';
import PostCard from '../components/PostCard.jsx'

export default function Search(){

    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');

        if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl
            })
        }

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();

            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/post/getPosts?${searchQuery}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });

            if(!res.ok){
                setLoading(false);
                return;
            }
            if(res.ok){
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);

                if(data.posts.length >= 9){
                    setShowMore(true);
                }else{
                    setShowMore(false);
                }
            }
        }
        fetchPosts();
    },[location.search]);


    const handleChange = (e) => {
        
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData, searchTerm: e.target.value})
        }

        if(e.target.id === 'sort'){
            const order = e.target.value || 'desc';
            setSidebarData({...sidebarData, sort: order});
        }

        if(e.target.id === 'category'){
            const category = e.target.value || 'uncategorized'
            setSidebarData({...sidebarData, category});
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }


    const handleShowMore = async () => {
        const numOfPosts = posts.length;
        const startIndex = numOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();

        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/post/getPosts?${searchQuery}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        if(!res.ok){
            return;
        }

        if(res.ok){
            const data = await res.json();
            setPosts([...posts, data.posts]);
            if(data.posts.length >= 9){
                setShowMore(true);
            }else{
                setShowMore(false)
            }
        }
    }

    return(
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Search Term:</label>
                        <TextInput id="searchTerm"
                                    type="text" 
                                    placeholder="Search..." 
                                    value={sidebarData.searchTerm}
                                    onChange={handleChange}/>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Sort:</label>
                        <Select id='sort' defaultValue={sidebarData.sort} onChange={handleChange}>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Category:</label>
                        <Select id='category' defaultValue={sidebarData.category} onChange={handleChange}>
                        <option value='uncategorized' >Uncategorized</option>
                        <option value='javascript' >javaScript</option>
                        <option value='reactjs' >React.js</option>
                        <option value='expressjs' >Express.js</option>
                        <option value='nodejs' >Node.js</option>
                        <option value='frontend' >Front-End</option>
                        <option value='backend' >Back-End</option>
                        <option value='mernstack' >MERN-Stack</option>
                        </Select>
                    </div>
                    <Button outline type="submit" gradientDuoTone='purpleToBlue'>
                        Apply Filters
                    </Button>
                </form>
            </div>
            <div className="w-full">
                <h1 className="text-semibold text-3xl sm:border-b border-gray-600 p-3 mt-5">Post results:</h1>
                <div className="p-7 flex flex-wrap gap-6">
                    {
                        !loading && posts.length === 0 && (
                            <p className="text-xl text-gray-500 font-semibold mx-auto">No posts found!</p>
                        )
                    }
                    {
                        loading && <SpinnerDotted color="purple" className="mx-auto mt-32
                        "/>
                    }

                    {
                        !loading && posts && 
                        posts.map((post) => (
                            <PostCard key={post._id} post={post}/>
                        ))
                    }
                    {
                        showMore && <button className="w-full text-white bg-teal-500 p-2 hover:bg-teal-800" onClick={handleShowMore}>
                            Show more
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}