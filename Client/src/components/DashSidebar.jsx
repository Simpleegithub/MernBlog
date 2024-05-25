import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/users/Userslice";
import { useDispatch, useSelector } from "react-redux";

function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleSignOUt = async () => {
    try {
      const res = await fetch(`api/user/signout`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFoundUrl = urlParams.get("tab");
    console.log("tabFoundUrl:", tabFoundUrl); // Log the tabFoundUrl
    if (tabFoundUrl) {
      setTab(tabFoundUrl);
    }
  }, [location.search]);

  console.log("tab state:", tab);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex  flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab == "profile"}
              icon={HiUser}
              label={currentUser.user.isAdmin ? 'Admin':'User'}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab == "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>



          )}


{currentUser.user.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab == "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>



          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOUt}
          >
            logOut
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
