import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Projects from "./pages/Projects.jsx"
import Signin from "./pages/Signin.jsx"
import Signup from "./pages/Signup.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="/projects" element={<Projects/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
