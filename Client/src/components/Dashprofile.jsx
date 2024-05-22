/*eslint-disable*/

import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link, useNavigate } from "react-router-dom";
import {HiOutlineExclamationCircle} from 'react-icons/hi'

import { app } from "../firebase";

import { signInFailure, signInSuccess, signOutSuccess, updateFailure, updateStart, updateSuccess,userDeleteFailure, userDeleteStart, userDeleteSuccess } from "../redux/users/Userslice";
import { Model } from "mongoose";

function Dashprofile() {
    const filePickerRef=useRef();

  const { currentUser,error,loading } = useSelector((state) => state.user);
  const [imagefile, setImageFile] = useState(null);
  const[imageFileUrl,setImageFileUrl]=useState(null);
  const [imagefileuploadprogress,setImageFileUploadProgress]=useState(null);
  const[imagefileuploaderror,setImageFileuploadError]=useState(null);
  const[imageFileuploading,setImageFileUploading]=useState(false);
  const[updateUserSuccess,setUpdatUserSuccess]=useState(null);
  const [formdata,setFormData]=useState({});
  const[updateUsererror,setUpdateUserError]=useState(null);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [showModel,setShowModel]=useState(false);

 
 console.log(imagefileuploadprogress,imagefileuploaderror);
 console.log(currentUser)


 const handleSignOUt=async()=>{
  try{
   const res=await fetch(`api/user/signout`,{
    method:"POST"
   })
   const data=await res.json();
   if(!res.ok){
    console.log(data.message)
   }else{
    dispatch(signOutSuccess())
   }

  }catch(error){
  console.log(error.message)
  }
 }

const handleDelete= async()=>{
  setShowModel(false)
  try{
    dispatch(userDeleteStart())
   const res= await fetch(`api/user/delete/${currentUser.user._id}`,{
    method:"DELETE",
    
   

   })
   const data=await res.json();

   if(!res.ok){
    dispatch(userDeleteFailure(error.message))
  
  }

   if(res.ok){
     dispatch(userDeleteSuccess(data))
    navigate('/sign-in');
   }

  } catch(error){
  // console.log(error.message);
  dispatch(userDeleteFailure(error.message))
  }
}



 const handleChange=(e)=>{
  setFormData({...formdata,[e.target.id]:e.target.value});
  console.log(formdata,'from dashprofile')
 }

 const handleSubmit=async (e)=>{
  e.preventDefault();
  setUpdatUserSuccess(null);
  setUpdateUserError(null)
  if(Object.keys(formdata).length==0){
    setUpdateUserError('No changes made')
    return;
  }
  if(imageFileuploading){
    setUpdateUserError('Please wait for image to upload')
    return;
  }

  try{
    dispatch(updateStart())
    const res=await fetch(`api/user/update/${currentUser.user._id}`,{
      method:"POST",
      headers:{'Content-Type': 'application/json',},
      body:JSON.stringify(formdata)
    })
  
    const data=await res.json();
  
    if (data.success === false){
      dispatch(updateFailure(data.message));
      setUpdateUserError(data.message)
    }
  
    if(res.ok){
      dispatch(updateSuccess(data));
      setUpdatUserSuccess("User's Profile Updated Successfully!")
    }
  

  }catch(error){
    dispatch(updateFailure(error.message));
    setUpdateUserError(error.message)
  }
 

 }



 
  const handleImageChange=(e)=>{

  

    const file=e.target.files[0];
    if(file){

        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file))
    }
  }

  useEffect(()=>{
    if(imagefile){
        uploadImage()
    }
  },[imagefile])

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileuploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imagefile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imagefile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileuploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formdata,profilePicture:downloadURL});
          setImageFileUploading(false)
        });
      }
    );
  };

 console.log(imagefile,imageFileUrl)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
    <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

    <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden/>

      <div className=' relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>

        {imagefileuploadprogress && (
         <CircularProgressbar value={imagefileuploadprogress || 0} text={`${imagefileuploadprogress}%`} strokeWidth={5} styles={{root:{
            width:'100%',
            height:'100%',
            position:"absolute",
            top:0,
            left:0
         },
         path:{
            color:`rgba(62,152,199,${imagefileuploadprogress/100})`
         }
        
        }} />

        )}
        <img
          src={imageFileUrl || currentUser.user.profilePicture}
          alt='user'
          className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imagefileuploadprogress && imagefileuploadprogress <100 && ' opacity-55'}`}
        />
      </div>
     {imagefileuploaderror && <Alert color='failure'>{imagefileuploaderror}</Alert>}
      
      <TextInput
        type='text'
        id='username'
        placeholder='username'
        defaultValue={currentUser.user.username}
         onChange={handleChange}
      />
      <TextInput
        type='email'
        id='email'
        placeholder='email'
        defaultValue={currentUser.user.email}
       onChange={handleChange}
      />
      <TextInput type='password' id='password' placeholder='password' onChange={handleChange}  />
      <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileuploading}>
          {loading?'loading...':'update'}
      </Button>
      {
        currentUser.user.isAdmin &&(
          <Link to='/create-post'>
          <Button type="button" gradientDuoTone='purpleToPink' className="w-full">Create a Post</Button>
          </Link>
        )
      }
    </form>
    <div className="text-red-500 flex justify-between mt-5">
      <span className='cursor-pointer' onClick={()=>setShowModel(true)}>Delete Account</span>
      <span className='cursor-pointer' onClick={handleSignOUt}>Sign Out</span>
    </div>
    {updateUserSuccess && (
    <Alert color='success' className="mt-5" >
      {updateUserSuccess}
       </Alert>
    )}

{updateUsererror && (
    <Alert color='failure' className="mt-5" >
      {updateUsererror}
       </Alert>
    )}

{error && (
    <Alert color='failure' className="mt-5" >
      {error}
       </Alert>
    )}

    <Modal show={showModel} onClose={()=>setShowModel(false)} popup size='md'>
   <Modal.Header/>
   <Modal.Body>
    <div className="text-center">
     <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
     <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete this account ?</h3>
     <div className="flex  justify-center gap-4">
     <Button className="" color='failure' onClick={handleDelete}>Yes I'm sure</Button>
     <Button className="" color='gray' onClick={()=>setShowModel(false)}>No, cancel</Button>
     </div>
    </div>
   </Modal.Body>
      </Modal>
  </div>
  );
}

export default Dashprofile;
