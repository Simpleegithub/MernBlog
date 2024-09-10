import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Dashprofile from '../components/Dashprofile';
import DashSidebar from '../components/DashSidebar';
import DashPosts from "../components/DashPosts";
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import DashComments from '../components/DashComments'

function Dashboard() {
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

  console.log("tab state:", tab); // Log the tab state to check its value

  return (
    <div className=" min-h-screen flex flex-col md:flex-row">
      <div className=" md:w-56">
        <DashSidebar/>
        </div>
      <div className="mx-auto w-full ">
        {tab==='profile'&&<Dashprofile/>}
        {tab==='posts'&&<DashPosts/>}
        {tab==='users'&&<DashUsers/>}
        {tab==='comments' && <DashComments/>}
        {tab==='dash' && <DashboardComp/>}
      </div>
    </div>
  );
}

export default Dashboard;
