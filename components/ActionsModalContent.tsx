
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormateDateTime from "./FormatedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RiDeleteBin5Line } from "react-icons/ri";


const ImageThumbnail = ({file}:{file:Models.Document})=> (
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} url={file.url}/>
        <div>
            <p>
                {file.name}
            </p>
            <FormateDateTime date={file.$createdAt} className="caption"/>
        </div>
    </div>
)

const DetailRow = ({label,value}:{label:string,value:string})=> (
    <div className="flex">
        <p className="file-details-label text-left">{label}</p>
        <p className="file-details-value text-left">{value}</p>
    </div>
)


export const FileDetails =  ({file}:{file:Models.Document})=> {
    return  (
        <>
        <ImageThumbnail file={file}/>
        <div className="space-y-2 px-2 py-2">
            <DetailRow label="Formate:" value={file.extension}/>
            <DetailRow label="Size:" value={convertFileSize(file.size)}/>
            <DetailRow label="Owner:" value={file.owner.fullName}/>
            <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)}/>

        </div>
        </>
    )

}
interface  Props {
    file: Models.Document;
    OnInputChange : React.Dispatch<React.SetStateAction<string[]>>;
    OnRemove : (email:string)=> void;

}
export const ShareInput =({file,OnInputChange,OnRemove}:Props)=> {
    return (
        <>
        <ImageThumbnail file={file}/>
        <div className="share-wrapper">
            <p className="subtitle-2 pl-1 text-light-100">
                Share with others User
            </p>
            <Input type="email" placeholder="Enter your email" 
            onChange={(e)=>OnInputChange(e.target.value.trim().split(","))}/>
            <div className="pt-4">
                <div className="flex justify-between">
                <p className="subtitle-2 text-light-100">Share with</p>
                <p className="subtitle-2 text-light-200">
                    {file.users.length} users
                </p>
                </div>

                <ul className="pt-2">
                    {file.users.map((email:string)=> (
                        <li key={email} className="flex justify-between items-center gap-2">
                            <p className="subtitloe-2">{email}</p>
                            <Button className="share-remove-user" onClick={()=> OnRemove(email)}>
                                <RiDeleteBin5Line size={24}  className="remove-icon"/>
                            </Button>


                        </li>

                    ))}

                </ul>
                
            </div>
        </div>
        </>
    )
}
