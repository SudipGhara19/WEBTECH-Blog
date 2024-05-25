import { Button } from "flowbite-react";
import { BsGoogle } from "react-icons/bs";
import { app } from "../firebase.js";
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { signInSuccess } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";



export default function OAuth(){

    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt: 'select_account'});
        try{
            const resultfromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/auth/google`, {
                method: "POST",
                credentials: 'include',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({
                    name: resultfromGoogle.user.displayName,
                    email: resultfromGoogle.user.email,
                    googlePhotoUrl: resultfromGoogle.user.photoURL,
                }),
            })

            const data = await res.json();
            if(res.ok){
                dispatch(signInSuccess(data));
                navigate('/')
            }
        }catch(error){
            console.log(error);
        }
    }

    return(
        <Button onClick={handleGoogleClick} className="bg-gradient-to-r from-pink-700 to-blue-500" type="button" outline>
            <BsGoogle className="w-5 h-5 mr-2  "/>
            Continue with Google
        </Button>
    )
}