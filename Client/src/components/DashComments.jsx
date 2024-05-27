import { Spinner, Table, TableHead, TableRow } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {FaCheck,FaTimes}from 'react-icons/fa'


function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading,setLoading]=useState(false);
 

  useEffect(() => {
    const fetchComments = async () => {
      if (!currentUser || !currentUser.user._id) return;  // Ensure currentUser is defined
      try {
        setLoading(true);
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        } else {
          console.log("Failed to fetch comments:", data.message);
        }
      } catch (error) {
        console.log("Error fetching comments:", error);
        setLoading(false);
      }
    };

    if (currentUser.user.isAdmin) {
      console.log(currentUser);
      fetchComments();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    console.log(startIndex, "form line 41");
    try {
      const res = await fetch(`api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      console.log(data, "from line 44");
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
      }
      if (data.comments.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const res = await fetch(`api/comment/deleteComment/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        console.log("Comment deleted successfully");
        // Remove the deleted user from users
        setComments((prevUsers) => prevUsers.filter((comment) => comment._id !== id));
      } else {
        console.log("Failed to delete Comment:", res.statusText);
      }
    } catch (error) {
      console.log("Error deleting Comment:", error);
    }
  };

  if(loading) return(
    <div className=" flex justify-center items-center min-h-screen">
    <Spinner size='xl' />
    </div>
)

  return (
    <div className="table-auto  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.user.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </TableHead>
            {comments.map((comment) => (
              <>
                <Table.Body className="divide-y" keys={comment._id}>
                  <Table.Row className="bg-white dark:border-gray-200 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                    {comment.content}
                    </Table.Cell>
                    <Table.Cell>
                  
                      {comment.numberOflikes}
                    </Table.Cell>

                    <Table.Cell>
                  
                  {comment.postId}
                </Table.Cell>
                    <Table.Cell>
                  
                      {comment.userId}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className="font-medium  text-red-500 hover:underline cursor-pointer"
                        onClick={() => handleDelete(comment._id)}
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                 
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no Comment yet</p>
      )}
    </div>
  );
}

export default DashComments;
