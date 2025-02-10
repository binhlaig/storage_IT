"use client"
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/button';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import { MdCloudUpload } from "react-icons/md";
import Thumbnail from '../Thumbnail';
import Image from 'next/image';
import { CiCircleRemove } from "react-icons/ci";
import { useToast } from "@/hooks/use-toast";
import { MAX_FILE_SIZE } from '@/constants';
import { UploadFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';


interface Props {
  ownerId: string;
  accountId: string;
  className: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path= usePathname();
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {

    setFiles(acceptedFiles);
    const uploadPromises = acceptedFiles.map(async (file) => {

      if (file.size > MAX_FILE_SIZE) {
        setFiles((prevFiles) =>
          prevFiles.filter((f) => f.name !== file.name),
        );

        return toast({
          description: (
            <p className="body-2 text-white">
              <span className="font-semibold">{file.name}</span> is too large.
              Max file size is 50MB.
            </p>
          ),
          className: "error-toast",
        });
      }
      return UploadFile({ file, ownerId, accountId, path }).then(
        (uploadedFile) => {
          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
          }
        },
      );


    });
    await Promise.all(uploadPromises);
  }, [ownerId, accountId, path])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleRemoveFile = (e:React.MouseEvent<SVGElement>, fileName: string)=> {
    e.stopPropagation();
    setFiles((prevFiles)=>prevFiles.filter((file)=>file.name !== fileName));
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button type='button' className={cn("uploader-button", className)}>
        <MdCloudUpload size={30} />{" "}
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100 '>Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                <div className='flex items-center gap-3'>
                  <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)} />
                  <div className='preview-item-name'>
                    {file.name}
                    <Image src={"/assets/icons/file-Loader.gif"} alt='loader' width={80} height={26} />
                  </div>
                </div>
                <CiCircleRemove size={24} onClick={(e)=> handleRemoveFile(e,file.name)}/>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default FileUploader
