import { Spinner, Table, TableHead, TableRow } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPost] = useState([]);
  const [showMore,setShowMore]=useState(true);
  const[loading,setLoading]=useState(false);
  console.log(userPosts);

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      if (!currentUser || !currentUser.user._id) return; // Ensure currentUser is defined
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${currentUser.user._id}`
        );
        const data = await res.json();
      
        if (res.ok) {
          setUserPost(data.posts);
          setLoading(false);
         
          if(data.posts.length<9){
            setShowMore(false)
          } else{
            setShowMore(true)
          }
        } else {
          console.log("Failed to fetch posts:", data.message);
          setLoading(false)
        }
      } catch (error) {
        console.log("Error fetching posts:", error);
          setLoading(false)


      }
    };

    if (currentUser.user.isAdmin) {
      console.log(currentUser);
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore=async()=>{
   const startIndex=userPosts.length;
   console.log(startIndex,'form line 41')
   try{
    setLoading(true);
   const res=await fetch(`api/post/getposts?userId=${currentUser.user._id}&startIndex=${startIndex}`)
   const data=await res.json();
   console.log(data,'from line 44')
   if(res.ok){
     setLoading(false)
    setUserPost((prev)=>[...prev,...data.posts])
   }
    if(data.posts.length<9){
        setShowMore(false)
    }
   } catch(error){
    console.log(error)
    setLoading(false)
   }
  }

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const res = await fetch(`api/post/delete/${id}/${currentUser.user._id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        console.log('Post deleted successfully');
        // Remove the deleted post from userPosts
        setUserPost((prevPosts) => prevPosts.filter((post) => post._id !== id));
      } else {
        console.log('Failed to delete post:', res.statusText);
      }
    } catch (error) {
      console.log('Error deleting post:', error);
    }
  };

  
  if(loading) return(
    <div className=" flex justify-center items-center min-h-screen">
    <Spinner size='xl' />
    </div>
)
  
  return (
    <div className="table-auto  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.user.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </TableHead>
            {userPosts.map((post) => (
              <>
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-200 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>{post.title}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>{post.category}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium  text-red-500 hover:underline cursor-pointer" onClick={()=>handleDelete(post._id)}>Delete</span>
                    </Table.Cell>
                    <Table.Cell>
                    <Link to={`/update-post/${post._id}`} className=" text-teal-500 hover:underline">
                      <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </>
            ))}
          </Table>
          {
            showMore && (
                <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show more</button>
            )
          }
        </>
      ) : (
        <p>You have no Post yet</p>
      )}
    </div>
  );
}

export default DashPosts;
