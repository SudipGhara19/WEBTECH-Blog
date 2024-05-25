import { TextInput, Button, Alert } from 'flowbite-react';
import { useState, useRef, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice.js';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function DashProfile(){
    const {currentUser} = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [formData, setFormData] = useState({});
    const filePickRef = useRef();


    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };


    useEffect(() => {
        if(imageFile){
            uploadImage();
        }
    }, [imageFile]);

    //uploading image file to the firebase and then creating the img-URL to for saving in database
    const uploadImage = async () => {
        // console.log(`Uploading image...`);
        setImageFileUploading(true);
        setImageUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageUploadError('Could not upload image (File must be less than 2MB).');
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePicture: downloadURL});
                    setImageFileUploading(false);
                })
            }
        )
    };



    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        
        if(Object.keys(formData).length === 0){
            setUpdateUserError('No changes made.')
            return;
        }

        if(imageFileUploading){
            setUpdateUserError('Please wait for image to upload. ')
            return;
        }

        try{
            dispatch(updateStart());
            const res = await fetch(`${process.env.REACT_APP_BACKEND}api/user/update/${currentUser._id}`, {
                method: "PUT",
                credentials: 'include',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            

            if(data.success === false){
                setUpdateUserError(data.message);
                return dispatch(updateFailure(data.message));
            }else{
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User's profile updated successfully.")
            }
        }catch(error) {
            dispatch(updateFailure(error.message));
        }
    }

    return(
        <div className="mx-auto max-w-lg p-3 w-full">
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
            <input type='file' accept='image/*'  onChange={handleImageChange} ref={filePickRef} hidden='true'/>
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickRef.current.click()}>
                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root:{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            },
                            path: {
                                stroke: `rgba(62, 152, 199, ${
                                    imageFileUploadProgress / 100
                                  })`
                            }
                        }}
                        />
                    )}
                    <img src={imageFileUrl ? imageFileUrl : currentUser.profilePicture} alt='user' className={`rounded-full h-full w-full object-cover border-8 border-gray-400 ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-70'}`}/>
                </div>
                {imageFileUploadError && (<Alert color='failure'>{imageFileUploadError}</Alert>)}
                <TextInput 
                    type="text"
                    id="username"
                    placeholder='username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput 
                    type="email"
                    id="email"
                    placeholder='email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput 
                    type="password"
                    id="password"
                    placeholder='password'
                    onChange={handleChange}
                />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
            </form>
            <div className='flex flex-row justify-between text-red-600 mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (<Alert color='success' className='mt-5 '>
                {updateUserSuccess}
            </Alert>)}

            {updateUserError && (<Alert color='failure' className='mt-5 '>
                {updateUserError}
            </Alert>)}
        </div>
    )
}