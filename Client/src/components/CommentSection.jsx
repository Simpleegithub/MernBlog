import { Alert, Button, TextInput, Textarea } from "flowbite-react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

function CommentSection({postId}) {
    const [comments,setComments]=useState('');
 
    const {currentUser} =useSelector((state)=>state.user); 
    const [commentError,setCommentError]=useState(null)//
    console.log(comments,postId,currentUser.user._id)


    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(comments.length>200){
            return;
        }
        if(comments.length==0){
            setCommentError('You should write something First! to add comment')
        }
        try{
            const res=await fetch('/api/comment/create',{
                method:'POST',
                headers:{'Content-Type':"application/json"},
                body:JSON.stringify({content:comments,postId,userId:currentUser.user._id})
            })
    
            const data=await res.json();
    
            if(res.ok){
                setComments('');
                setCommentError(null)
            }

        } catch(error){
         console.log(error);
         setCommentError(error.message)
        }
 

    }
  
    return (
        <div className=" max-w-2xl mx-auto w-full p-3">
            {currentUser ? (
                <div className=" flex items-center gap-1 my-5 text-gray-500 text-sm">
              <p>Signed In as:</p>
              <img src={currentUser.user.profilePicture} className="h-5 w-5 object-cover rounded-full" alt="" />
              <Link to='/dashboard?tab=profile' className=" text-sx text-cyan-500 hover:underline">
              @{currentUser.user.username}
              </Link>
                </div>
            ):(
                <div className=" text-teal-500 my-5 flex gap-1">
                You must be signed in to connect. 
                <Link to='/sign-in' className="text-blue-500">
                  Sign In
                </Link>
                </div>
            )} 

            {currentUser && (
                <form onSubmit={handleSubmit} className="border border-teal-500 p-3 rounded-md">
                    <Textarea placeholder="Add a Comment...." rows='3' maxLength='200' onChange={(e)=>setComments(e.target.value)} value={comments}/>
                    <div className="flex flex-row justify-between items-center mt-5">
                    <p className="text-gray-500 text-xs">{200-comments.length} characters left remaining</p>
                    <Button type="submit" gradientDuoTone='purpleToBlue' outline>Submit</Button>
                    </div>
                   
                </form>
            )}

            {commentError && <Alert className="mt-5" color='failure'>{commentError}</Alert>}
        </div>
    )
}

export default CommentSection
