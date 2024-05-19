import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"

export default function Signin(){

    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    //saving form data
    const handleChange = (e) => {
        e.preventDefault();
        setFormData({...formData, [e.target.id]: e.target.value.trim()});
    }

    //on submitting the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.email || !formData.password){
            return setErrorMessage("Please fill out all the fields.")
        }

        try{
            setLoading(true);
            setErrorMessage(null);
            const res = await fetch('http://127.0.0.1:5001/api/auth/signin', {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if(data.success === false){
                setLoading(false);
                return setErrorMessage(data.message);
            }
             setLoading(false);
             if(res.ok){
                navigate('/')
             }
        }catch(error)  {
            setErrorMessage(error.message);
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen mt-20">
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10">
                {/* LEFT section*/}
                <div className="flex-1">
                <Link to='/' className="font-bold dark:text-white text-4xl">
                    <span className="px-2 py-1 bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-700 text-white rounded-md">
                    WEBtech-BLOG
                    </span>
                </Link>
                <p className="text-sm mt-6">
                    You can signin using your email 
                    and password or with Google.
                </p>
                </div>

                {/* RIGHT section */}
                <div className="flex-1">
                    
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                        <Label value="Your email"/>
                        <TextInput type="email" placeholder="name@mail.com" id="email" onChange={handleChange}/>
                        </div>
                        <div>
                        <Label value="Your password"/>
                        <TextInput type="password" placeholder="Password" id="password" onChange={handleChange}/>
                        </div>
                        <Button gradientDuoTone='purpleToBlue' type="submit" disabled={loading}>
                            {loading ? (
                            <>
                                <Spinner size='sm'/>
                                <span className="pl-3">Loading...</span> 
                            </>
                        ): 'Sign In'
                        }
                            
                        </Button>
                    </form>

                    <div className="flex gap-2 text-sm mt-5">
                        <span>Don't have an account?</span>
                        <Link to='/signup' className="text-blue-500">Sign up</Link>
                    </div>
                    {
                        errorMessage && (
                            <Alert className="mt-5" color='failure'>
                                {errorMessage}
                            </Alert>
                        )
                    }
                </div>
            </div>
        </div>
    )
}