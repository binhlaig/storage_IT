"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import React, { useState } from "react"
import { X } from 'lucide-react';
import { Loader } from 'lucide-react';
import { Button } from "./ui/button";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";



const OTPModal = ({ accountId, email }: { accountId: string; email: string }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const sessionId = await verifySecret({ accountId, password });

            if (sessionId !== undefined) router.push("/")

        } catch (error) {
            console.log("Failed to verify OTP", error);
        }
        setIsLoading(false);
    }

    const handleResendOtb = async () => {
        await sendEmailOTP({ email });
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader className="relative flex justify-center">
                    <AlertDialogTitle className="h2 text-center">
                        Enter Your OTP
                        <X size={20} onClick={() => setIsOpen(false)} className="otp-close-button" />

                    </AlertDialogTitle>
                    <AlertDialogDescription className="subtitle-2 text-center">
                        We've sent a code to{" "}
                        <span className="pl-1 text-brand">sai@gmail.com</span>

                    </AlertDialogDescription>
                </AlertDialogHeader>
                <InputOTP maxLength={6} value={password} onChange={setPassword}>
                    <InputOTPGroup className="shad-otp">
                        <InputOTPSlot index={0} className="shad-otp-slot" />
                        <InputOTPSlot index={1} className="shad-otp-slot" />
                        <InputOTPSlot index={2} className="shad-otp-slot" />
                        <InputOTPSlot index={3} className="shad-otp-slot" />
                        <InputOTPSlot index={4} className="shad-otp-slot" />
                        <InputOTPSlot index={5} className="shad-otp-slot" />
                    </InputOTPGroup>
                </InputOTP>
                <AlertDialogFooter>
                    <div className="flex w-full flex-col gap-4">
                        <AlertDialogAction onClick={handleSubmit} type="button" className="shad-submit-btn h-12">
                            Submit
                            {isLoading &&
                                <Loader size={24} className="ml-2 animate-spin" />
                            }
                        </AlertDialogAction>
                        <div className="subtitke-2 mt-2 text-center text-light-100">
                            Didn't get a code?
                            <Button type="button" onClick={handleResendOtb}
                                className="pl-1 text-brand" variant="link">Click to resend</Button>

                        </div>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default OTPModal
