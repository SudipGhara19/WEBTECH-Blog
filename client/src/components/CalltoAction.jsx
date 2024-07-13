import { Button } from "flowbite-react";

export default function CallToAction(){
    return(
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
            <div className="flex-1 justify-center flex flex-col">
                <h2 className="text-2xl">Want to see more projects?</h2>
                <p className="text-gray-500 my-3">Check out more projects built over MERN technologies on GitHub</p>
                <Button gradientDuoTone='purpleToBlue' className="rounded-full rounded-bl-none rounded-tr-none mx-5">
                    <a href="https://github.com/SudipGhara19" target="_blank" rel="noopener noreferrer">More Projects</a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <img className="" src="https://inzint.com/wp-content/uploads/2023/02/Features-of-Mern-stack-development-services-You-Should-Know-1.png" alt="action-img"/>
            </div>
        </div>
    )
}