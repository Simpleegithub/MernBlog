import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Dashprofile from '../components/Dashprofile';
import DashSidebar from '../components/DashSidebar'

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
      <div className="mx-auto w-full">
        {tab==='profile'&&<Dashprofile/>}
      </div>
    </div>
  );
}

export default Dashboard;
