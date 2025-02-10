import { MdDashboard } from "react-icons/md";
import { MdEditDocument } from "react-icons/md";
import { FaImages } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { MdPieChart } from "react-icons/md";


export const navItems = [
    {name:"Dashboard",icon: MdDashboard ,url: "/"},
    {name:"Documents",icon: MdEditDocument,url: "/Documents"},
    {name:"Images", icon: FaImages,url:"/images"},
    {name:"Media", icon: FaVideo,url:"/media"},
    {name:"Other",icon: MdPieChart, url:"/orher"}
]

export const actionsDropdownItems = [
    {
      label: "Rename",
      icon: "/assets/icons/edit.svg",
      value: "rename",
    },
    {
      label: "Details",
      icon: "/assets/icons/info.svg",
      value: "details",
    },
    {
      label: "Share",
      icon: "/assets/icons/share.svg",
      value: "share",
    },
    {
      label: "Download",
      icon: "/assets/icons/download.svg",
      value: "download",
    },
    {
      label: "Delete",
      icon: "/assets/icons/delete.svg",
      value: "delete",
    },
  ];
  

export const avatorPlaceholderderurl = "/image/avator.webp"

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB