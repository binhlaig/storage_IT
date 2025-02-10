"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { usePathname } from "next/navigation";
import { useState } from "react"
import { CiMenuBurger } from "react-icons/ci";



const MobileNavigation = () => {
  const [open,setOpen] = useState(false);
  const pathname = usePathname();

  return <header className="mobile-header">
    <Image src="/image/logo.png" alt="logo" width={120} height={52} className="h-auto" />

    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <CiMenuBurger size={30}/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>


  </header>
}

export default MobileNavigation
