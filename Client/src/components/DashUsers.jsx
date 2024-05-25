import { Spinner, Table, TableHead, TableRow } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {FaCheck,FaTimes}from 'react-icons/fa'

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading,setLoading]=useState(false);
  console.log(users);

  useEffect(() => {
    
    const fetchUsers = async () => {
      if (!currentUser || !currentUser.user._id) return; // Ensure currentUser is defined
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        console.log(data, "from line 20 user");
        if (res.ok) {
          setLoading(false)
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        } else {
          console.log("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    if (currentUser.user.isAdmin) {
      console.log(currentUser);
      fetchUsers();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    console.log(startIndex, "form line 41");
    try {
      const res = await fetch(`api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      console.log(data, "from line 44");
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
      }
      if (data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const res = await fetch(`api/user/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        console.log("User deleted successfully");
        // Remove the deleted user from users
        setUsers((prevUsers) => prevUsers.filter((User) => User._id !== id));
      } else {
        console.log("Failed to delete User:", res.statusText);
      }
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  if(loading) return(
    <div className=" flex justify-center items-center min-h-screen">
    <Spinner size='xl' />
    </div>
)

  return (
    <div className="table-auto  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.user.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </TableHead>
            {users.map((user) => (
              <>
                <Table.Body className="divide-y" keys={user._id}>
                  <Table.Row className="bg-white dark:border-gray-200 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                  
                      {user.username}
                    </Table.Cell>

                    <Table.Cell>
                  
                  {user.email}
                </Table.Cell>
                    <Table.Cell>
                  
                        {user.isAdmin ? (<FaCheck className='text-green-500'/>) :(<FaTimes className='text-red-500'/>) }
                  
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className="font-medium  text-red-500 hover:underline cursor-pointer"
                        onClick={() => handleDelete(user._id)}
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
        <p>You have no User yet</p>
      )}
    </div>
  );
}

export default DashUsers;
