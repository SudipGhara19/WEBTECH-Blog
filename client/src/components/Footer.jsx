import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble} from 'react-icons/bs';

export default function FooterCom(){
    return(
        <Footer className="border border-t-8 border-teal-500" container>
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                <div className="mt-5">
                <Link to='/' className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
                    <span className="px-2 py-1 bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-700 text-white rounded-md">
                        WEBtech-BLOG
                    </span>
                </Link>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                    <div>
                        <Footer.Title title="ABOUT"/>
                        <Footer.LinkGroup col>
                            <Footer.Link 
                            href="https://github.com/SudipGhara19/WEBTECH-Blog"
                            target="_blank"
                            rel="noopener noreferrer">
                                Github
                            </Footer.Link>
                            <Footer.Link 
                            href="/about"
                            target="_blank"
                            rel="noopener noreferrer">
                                About WEBtech-BLOG
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title="FOLLOW US"/>
                        <Footer.LinkGroup col>
                            <Footer.Link 
                            href="https://github.com/SudipGhara19"
                            target="_blank"
                            rel="noopener noreferrer">
                                Github
                            </Footer.Link>
                            <Footer.Link 
                            href="https://linkedin.com/in/sudip-ghara-b24865214"
                            target="_blank"
                            rel="noopener noreferrer">
                                Linkedin
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title="LEGAL"/>
                        <Footer.LinkGroup col>
                            <Footer.Link 
                            href="#">
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link 
                            href="#">
                                Terms & Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider />
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright href="#" by="Sudip Ghara" year={new Date().getFullYear()}/>
            
                <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                    <Footer.Icon href="#" icon={BsFacebook}/>
                    <Footer.Icon href="#" icon={BsInstagram}/>
                    <Footer.Icon href="#" icon={BsTwitter}/>
                    <Footer.Icon href="https://github.com/SudipGhara19/WEBTECH-Blog" icon={BsGithub}/>
                    <Footer.Icon href="#" icon={BsDribbble}/>
                </div>
            </div>
        </div>
        </Footer>
    )
}