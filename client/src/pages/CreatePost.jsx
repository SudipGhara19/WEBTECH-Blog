import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();

    const handleImageUpload = async () => {
        try{
            if(!file){
                setImageUploadError('Please select an image file.')
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image upload fail.');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({...formData, image: downloadURL});
                    })
                }
            )
        }catch(error){
            setImageUploadProgress(null);
            setImageUploadError('Image upload failed.')
            console.log(error);
        }
    }


    const handleSubmitPost = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/post/create`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            console.log(`Data in createPost::::${data}`)
            console.log(data.message);
            if(!res.ok){
                return setPublishError(data.message);
            }
            if(res.ok){
                setPublishError(null);
                navigate(`/post/${data.slug}`)
            }
        }catch(error){
            console.log(error)
            setPublishError(error.message)
        }
    }

    return(
        <div className="min-h-screen p-3 max-w-3xl mx-auto">
            <h1 className="text-center font-semibold text-3xl my-7">Create a new Post</h1>
            {imageUploadError && <Alert className="mb-3" color='failure'>{imageUploadError}</Alert>}
            <form className="flex flex-col gap-4" onSubmit={handleSubmitPost}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type="text" 
                                placeholder="Title"  
                                required 
                                className="flex-1"
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                    <Select onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value='uncategorized' >Select a category</option>
                        <option value='javascript' >javaScript</option>
                        <option value='reactjs' >React.js</option>
                        <option value='expressjs' >Express.js</option>
                        <option value='nodejs' >Node.js</option>
                        <option value='frontend' >Front-End</option>
                        <option value='backend' >Back-End</option>
                        <option value='mernstack' >MERN-Stack</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-2 border-teal-500 border-dotted p-3'>
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])}/>
                    <Button type="button" 
                            gradientDuoTone='purpleToBlue' 
                            size='sm'outline 
                            onClick={handleImageUpload}
                            disabled={imageUploadProgress}
                            >
                                {
                                    imageUploadProgress ? 
                                    <div>
                                        <CircularProgressbar className="h-12 w-12" value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
                                    </div>
                                    : 'Upload image'
                                }
                    </Button>
                </div>
                {
                    formData.image && <img alt="post" src={formData.image} className="w-full h-72 object-cover" />
                }
                <ReactQuill theme="snow" 
                            className="h-72 mb-12" 
                            required
                            onChange={(value) => setFormData({...formData, content: value})}
                            />
                <Button type="submit" gradientDuoTone='purpleToBlue' className="mb-4">
                    Publish
                </Button>
                {publishError && <Alert className="mt-3" color='failure'>{publishError}</Alert>}
            </form>
        </div>
    )
}