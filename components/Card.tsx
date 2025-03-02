import Link from 'next/link'
import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from './Thumbnail'
import { convertFileSize } from '@/lib/utils'
import FormateDateTime from './FormatedDateTime'
import ActionDropDown from './ActionDropDown'

const Card = ({ file }: { file: Models.Document }) => {
    return (
        <Link href={file.url} target='_blank' className='file-card'>
            <div className='flex justify-between'>
                <Thumbnail type={file.type} extension={file.extension} url={file.url} className='!size-20' imageClassName='!size-11' />

                <div className='flex flex-col items-end justify-between'>
                   <ActionDropDown file={file}/>
                    <p className='body-1'> {convertFileSize(file.size)}</p>
                </div>
            </div>
            <div className='file-card-details'>
                <p className='subtitle-2 line-clamp-1'>{file.name}</p>
                <FormateDateTime date={file.$createdAt} className='caption text-light-100'/>
            </div>
        </Link>

    )

}

export default Card
