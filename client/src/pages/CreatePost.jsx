import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
    return(
        <div className="min-h-screen p-3 max-w-3xl mx-auto">
            <h1 className="text-center font-semibold text-3xl my-7">Create a new Post</h1>
            <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type="text" placeholder="Title" required className="flex-1"/>
                    <Select>
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
                    <FileInput type='file' accept='image/*' />
                    <Button type="button" gradientDuoTone='purpleToBlue' size='sm' outline>Upload image</Button>
                </div>
                <ReactQuill theme="snow" className="h-72 mb-12" required/>
                <Button type="submit" gradientDuoTone='purpleToBlue' className="mb-4">
                    Publish
                </Button>
            </form>
        </div>
    )
}