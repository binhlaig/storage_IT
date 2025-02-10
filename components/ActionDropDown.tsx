'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useState } from "react"
import { CiCircleList } from "react-icons/ci";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BiLoaderCircle } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { DeleteFile, renameFile, UpdateFile } from "@/lib/actions/file.actions";
import { FileDetails, ShareInput } from "./ActionsModalContent";


const ActionDropDown = ({ file }: { file: Models.Document }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name);
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState<string[]>([]);
    const path = usePathname()


    const closeAllModals = () => {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);
        setName(file.name);
        //   setEmails([]);
    };
    const handleRemovel = async (email: string) => {
        const updateEmails = emails.filter((e) => e !== email);
        const onSuccess = await UpdateFile({
            fileId: file.$id,
            emails: updateEmails,
            path
        });
        if (onSuccess) setEmails(updateEmails);
    }


    const hanndleAction = async () => {
        if (!action) return;
        setLoading(true);
        let success = false;
        const actions = {
            rename: () =>
                renameFile({ fileId: file.$id, name, extension: file.extension, path }),
            share: () => UpdateFile({ fileId: file.$id, emails, path }),
            delete: () => DeleteFile({ fileId: file.$id, bucketId: file.bucketId, path })
        }
        success = await actions[action.value as keyof typeof actions]()


        if (success) closeAllModals();

        setLoading(false);
    }

    const rederDilogContent = () => {
        if (!action) return null;
        const { label, value } = action;

        return <DialogContent className="shad-dialog button">
            <DialogHeader className="flex flex-col gap-3">
                <DialogTitle className="text-center text-light-100">{label}</DialogTitle>
                {value === "rename" && (
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                )}
                {value === "details" && <FileDetails file={file} />}
                {value === "share" && (
                    <ShareInput file={file} OnInputChange={setEmails} OnRemove={handleRemovel} />
                )}
                {value === "delete" && (
                    <p className="delete-confirmation">
                        Are you sure you want to delete{` `}
                        <span className="delete-file-name">{file.name}</span>

                    </p>
                )}
            </DialogHeader>
            {["rename", "delete", "share"].includes(value) && (
                <DialogFooter className="flex flex-col gap-3 md:flex-row">
                    <Button onClick={closeAllModals} className="modal-cancel-button">Cancle</Button>
                    <Button className="modal-submit-button" onClick={hanndleAction}>
                        <p className="capitalize">{value}</p>
                        {loading && (
                            <BiLoaderCircle className="animate-spin" />
                        )}
                    </Button>
                </DialogFooter>
            )}
        </DialogContent>
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger className="shad-no-focus">
                    <CiCircleList size={30} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="max-w-[200px] truncate">{file.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((actionItem) => (
                        <DropdownMenuItem key={actionItem.value} className="shad-dropdown-item"
                            onClick={() => {
                                setAction(actionItem);
                                if (["rename", "delete", "share", "details".includes(actionItem.value)]) {
                                    setIsModalOpen(true);
                                }
                            }}>
                            {actionItem.value === "download" ? (
                                <Link href={constructDownloadUrl(file.bucketId)}
                                    download={file.name} className="flex items-center gap-2">
                                    <Image src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                                    {actionItem.label}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Image src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                                    {actionItem.label}</div>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {rederDilogContent()}
        </Dialog>

    )
}

export default ActionDropDown
