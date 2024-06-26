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
                <img src="https://miro.medium.com/v2/resize:fit:1400/1*Hm-G7dLwMZtLOPWbL6nkww.jpeg" alt="action-img"/>
            </div>
        </div>
    )
}