
import {Sidebar} from 'flowbite-react';
import { useEffect, useState } from 'react';
import {HiUser, HiArrowSmRight, HiOutlineDocumentText, HiOutlineUsers, HiAnnotation} from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice.js';


export default function DashSidebar(){

    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser} = useSelector((state) =>  state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if(tabFromUrl){
            setTab(tabFromUrl);
        }

    }, [location.search]);

    const handleSignOut = async () => {
        try{
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/user/signout`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                console.log(data.message);
            }else{
                dispatch(signOutSuccess());
                navigate('/signin');
            }

        }catch(error){
            console.log(error.message);
        }
    }

    return(
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} 
                                    icon={HiUser}   
                                    label={currentUser.isAdmin ? 'Admin' : 'User'} 
                                    labelColor='dark'  
                                    as='div'
                    >
                        Profile
                    </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin &&
                        <Link to='/dashboard?tab=posts' >
                        <Sidebar.Item active={tab === 'posts'} icon={HiOutlineDocumentText} as='div'>
                            Posts
                        </Sidebar.Item>
                        </Link>
                    }

                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
                        Sign Out
                    </Sidebar.Item>
                    
                    {currentUser.isAdmin &&
                        <Link to='/dashboard?tab=users'>
                            <Sidebar.Item icon={HiOutlineUsers} className='cursor-pointer' as='div'>
                                Users
                            </Sidebar.Item>
                        </Link>
                    }  

                    {currentUser.isAdmin &&
                        <Link to='/dashboard?tab=comments'>
                            <Sidebar.Item icon={HiAnnotation} className='cursor-pointer' as='div'>
                                Comments
                            </Sidebar.Item>
                        </Link>
                    }      
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}