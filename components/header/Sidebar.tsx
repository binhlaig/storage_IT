"use client"
import { avatorPlaceholderderurl, navItems } from '@/constants'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { createElement } from 'react'


interface Props {
  fullName: string,
  email: string,
}

const Sidebar = ({ fullName, email }: Props) => {
  const pathname = usePathname()
  return (
    <aside className='sidebar'>
      <nav className='sidebar-nav'>
        <ul className='flex flex-1 flex-col gap-6'>
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className='lg:w-full'>
              <li className={cn("sidebar-nav-item", pathname === url && "shad-active")}>
                <span className={cn("nav-icon", pathname === url && "nav-icon-active")}>
                  {createElement(icon, {
                    size: 24,
                  })}
                </span>
                <p className='hidden lg:block'>{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src="/image/files-2.png"
        alt="logo"
        width={490}
        height={100} />
      <div className='sidebar-user-info'>
        <Image src={avatorPlaceholderderurl} alt='Avatar' width={44} height={44} className='sidebar-user-avatar' />
        <div className='hidden lg:block'>
          <p className='subtitle-2 capitalize'>{fullName}</p>
          <p className='caption'>{email}</p>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar
