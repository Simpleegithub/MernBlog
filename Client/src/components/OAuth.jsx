/* eslint-disable */

import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai";
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/users/Userslice";
import { useNavigate } from "react-router-dom";

function OAuth() {
    const navigate=useNavigate();
    const dispatch=useDispatch()
    const handleGoogleClick=async()=>{
        const auth=getAuth(app);

        const provider=new GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account'});

        try{
        const resultsFromGoogle=await signInWithPopup(auth,provider);
        const res=await fetch('api/auth/google',{
            method:"POST",
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify({
                name:resultsFromGoogle.user.displayName,
                email:resultsFromGoogle.user.email,
                profilePicture:resultsFromGoogle.user.photoURL


            })
            
        });

        const data=await res.json();
        console.log(data,'from line 36')
        if(res.ok){
            dispatch(signInSuccess(data))
            navigate('/');
            console.log('Successfull from line 38')
        }
        console.log(resultsFromGoogle)
        } catch(error){
            console.log(error)
        }

    }
    return (
        <Button type="button" gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
           <AiFillGoogleCircle className="w-6 h-6 mr-2"/> 
           Continue with Google
        </Button>
    )
}

export default OAuth
