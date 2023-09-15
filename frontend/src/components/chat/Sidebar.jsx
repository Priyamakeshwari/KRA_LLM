import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { TbListNumbers, TbUserX } from "react-icons/tb";
import { BsFillChatTextFill } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";

import { ImBin } from "react-icons/im";

import { BsChatRightDotsFill } from "react-icons/bs";
const Sidebar = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="">
      <div
        className={`bg-zinc-100 dark:bg-[#1c1f23] dark:text-white min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 px-4 relative`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>

        {open ? (
          <div className="delay-300 text-3xl font-semibold pl-4">
            Rescue <span className="text-green-500 font-extrabold ">Squad</span>
          </div>
        ) : (
          <div className="font-bold text-2xl delay-100">RS</div>
        )}

        <div className="mt-4 flex flex-col   w-full">
          <div className="gap-4 ">
            <Link
              to={"/"}
              className={` mt-5 group flex items-center text-lg  gap-3.5 font-medium p-2 hover:bg-green-500 rounded-md`}
            >
              <div className="text-green-500">
                <BsFillChatTextFill />
              </div>
              <h2
                style={{ transitionDelay: `${3}00ms` }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                Chat
              </h2>
            </Link>
          </div>

          <div className="  absolute bottom-4 ">
            <Link
              to={"/"}
              className={` mt-5 group flex items-center text-lg  gap-3.5 font-medium p-2 hover:bg-green-500 rounded-md`}
            >
              <div className="text-green-500">
                <ImBin />
              </div>
              <h2
                style={{ transitionDelay: `${3}00ms` }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                Clear Chat
              </h2>
            </Link>
            <Link
              to={"/"}
              className={` mt-5 group flex items-center text-lg  gap-3.5 font-medium p-2 hover:bg-green-500 rounded-md`}
            >
              <div className="text-green-500">
                <FaSignOutAlt />
              </div>
              <h2
                style={{ transitionDelay: `${3}00ms` }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                SignOut
              </h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
