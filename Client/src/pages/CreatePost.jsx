/*eslint-disable*/
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";

import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage';
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import {app} from '../firebase'

function CreatePost() {

  const[file,setfile]=useState(null);
  const [imageuploadprogress,setImageUploadProgress]=useState(null);
  const [imageuploaderror,setImageUploadError]=useState(null);
  const [formdata,setformdata]=useState({});
  
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
  
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setformdata({ ...formdata, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategoried">Select a Category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React</option>
            <option value="nextjs">Next.Js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">

          <FileInput type="file" accept="image/*"  onChange={(e)=>setfile(e.target.files[0])} />

          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpdloadImage}
            disabled={imageuploadprogress}
          >
            {
              imageuploadprogress ?
              <div className="w-16 h-16">
             <CircularProgressbar value={imageuploadprogress} text={`${imageuploadprogress || 0}%`}/>
              </div>
              :"upload Image"
            }
          </Button>
        </div>
        {imageuploaderror && (
          <Alert color='failure'>
          {imageuploaderror}
          </Alert>
        )}
        {formdata.image && (
          <img src={formdata.image} alt="upload" className="w-full h-72 object-cover"/>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something..."
          className="h-72 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
