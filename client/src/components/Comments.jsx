import { useEffect, useState } from "react"
import moment from 'moment';

export default function Comments({comment}){

    const [user, setUser] = useState({});
    console.log(user);

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
    }, [comment])
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
            </div>
        </div>
    )
}