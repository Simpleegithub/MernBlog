/*eslint-disable*/

import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { app } from "../firebase";

function Dashprofile() {
    const filePickerRef=useRef();

  const { currentUser } = useSelector((state) => state.user);
  const [imagefile, setImageFile] = useState(null);
  const[imageFileUrl,setImageFileUrl]=useState(null);
  const [imagefileuploadprogress,setImageFileUploadProgress]=useState(null);
  const[imagefileuploaderror,setImageFileuploadError]=useState(null);
 console.log(imagefileuploadprogress,imagefileuploaderror)
 
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

 console.log(imagefile,imageFileUrl)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
    <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
    <form className='flex flex-col gap-4'>

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
      />
      <TextInput
        type='email'
        id='email'
        placeholder='email'
        defaultValue={currentUser.user.email}
      />
      <TextInput type='password' id='password' placeholder='password' />
      <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
      </Button>
    </form>
    <div className="text-red-500 flex justify-between mt-5">
      <span className='cursor-pointer'>Delete Account</span>
      <span className='cursor-pointer'>Sign Out</span>
    </div>
  </div>
  );
}

export default Dashprofile;
