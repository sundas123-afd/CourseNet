// 'use client'

// import toast from 'react-hot-toast'

// import { UploadDropzone } from '@/lib/uploadthing';
// import { ourFileRouter } from '@/app/api/uploadthing/core';

// interface FileUploadProps {
//   onChange: (url?: string) => void
//   endpoint: keyof typeof ourFileRouter
// }

// export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
//   return (
//     <UploadDropzone
//       endpoint={endpoint}
//       onClientUploadComplete={res => onChange(res?.[0].url)}
//       onUploadError={() => {
//         toast.error('Upload failed. Please try again.')
//       }}
//     />
//   )
// }

'use client'

import toast from 'react-hot-toast'
import { UploadDropzone } from '@/lib/uploadthing'

interface FileUploadProps {
  onChange: (url?: string) => void
  endpoint: "courseImage" | "courseAttachment" | "chapterVideo"
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log('Upload completed:', res)
        if (res?.[0]?.url) {
          onChange(res[0].url)
          toast.success('Upload successful!')
        } else {
          toast.error('Upload completed but no URL received')
        }
      }}
      onUploadError={(error) => {
        console.error('Upload error:', error)
        if (error.message.includes('Unauthorized')) {
          toast.error('Please sign in to upload files')
        } else {
          toast.error(`Upload failed: ${error.message}`)
        }
      }}
    />
  )
}


