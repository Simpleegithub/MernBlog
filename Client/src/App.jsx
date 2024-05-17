import { BrowserRouter, createBrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Projects from "./pages/Projects";
import Dashboard from './pages/Dashboard'



function App() {
  return (
    <div>
     <BrowserRouter>
     <Routes>
     <Route path="/" element={<Home/>}/>
     <Route path="/about" element={<About/>}/>
     <Route path="/sign-in" element={<SignIn/>}/>
     <Route path="/sign-up" element={<SignUp/>}/>
     <Route path="/Dashboard" element={<Dashboard/>}/>
     <Route path="/projects" element={<Projects/>}/>
     </Routes>
     
     </BrowserRouter>
    </div>
  );
}

export default App;
