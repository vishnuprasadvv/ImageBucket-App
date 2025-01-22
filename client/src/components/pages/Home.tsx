import { logoutApi } from "@/api/userApi";
import { RootState } from "@/app/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/features/userSlice";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

const Home: React.FC = () => {
    const {user} = useSelector((state:RootState)=> state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    
    const handleLogout = async() => {
      try {
        await logoutApi()
        dispatch(logout())
        toast.success("Loggedout successfully")
        navigate('/login')
      } catch (error) {
        console.error('Error logging out', error)
      }
      
    }
  return (
    <div className="bg-gray-100 ">
      <div className="max-w-7xl w-full place-self-center">
      <div className="min-w-screen m-0 bg-indigo-100 h-16  flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-indigo-700 pl-2">ImageBucket</h1>
        <div className="flex items-center gap-4">
          <div>
            <span>Hi, {user?.email} </span>
          </div>
          <Popover>
            <PopoverTrigger>
              <div className="mr-2 bg-slate-300 aspect-square rounded-full">
                <img
                  className="w-12 rounded-full m-0 p-0  hover:border-2 border-red-300"
                  src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                  alt="image"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="text-red-500 hover:bg-slate-100 hover:cursor-pointer p-2" onClick={handleLogout}>Logout</div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <Dashboard />
      </div>
      </div>
      
    </div>
  );
};

export default Home;
