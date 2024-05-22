import { TextInput, Button } from 'flowbite-react';
import {useSelector} from 'react-redux';

export default function DashProfile(){
    const {currentUser} = useSelector((state) => state.user);

    return(
        <div className="mx-auto max-w-lg p-3 w-full">
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-3'>
                <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
                    <img src={currentUser.profilePicture} alt='user' className='rounded-full h-full w-full object-cover border-8 border-gray-400'/>
                </div>
                <TextInput 
                    type="text"
                    id="username"
                    placeholder='username'
                    defaultValue={currentUser.username}
                />
                <TextInput 
                    type="email"
                    id="email"
                    placeholder='email'
                    defaultValue={currentUser.email}
                />
                <TextInput 
                    type="password"
                    id="password"
                    placeholder='password'
                />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
            </form>
            <div className='flex flex-row justify-between text-red-600 mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}