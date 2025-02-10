import React from 'react'
import { SquareLibrary } from 'lucide-react';
import Image from 'next/image';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex min-h-screen'>
            <section className='bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5'>
                <div className='flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12'>
                    Bin Hlaig Store
                    <div className='space-y-5 text-white'>
                        <h1 className='h1'>Manage your files the best way</h1>
                        <p className='body-1'>
                            This is a place where you can store all your documents.
                        </p>
                    </div>
                    <Image src="/image/files-2.png" alt='Files' width={342} height={342}
                        className='transition-all hover:rotate-2 hover:scale-105' />
                </div>

            </section>
            <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
                <div className='mb-16 font-bold lg:hidden '>
                    Bin Hlaig Store
                </div>
                {children}
            </section>
        </div>
    )
}

export default AuthLayout
