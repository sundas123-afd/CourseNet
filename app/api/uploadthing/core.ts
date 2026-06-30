// import { auth } from '@clerk/nextjs/server';
// import { UTApi } from "uploadthing/server";
// import { createUploadthing, type FileRouter } from 'uploadthing/next';

// // import { isTeacher } from '@/lib/teacher'

// const f = createUploadthing()

// export const utapi = new UTApi();

// const handleAuth = () => {
//   const { userId } = auth()
// //   const isAuthorized = isTeacher(userId)

//   if (!userId) throw new Error('Unauthorized')
//   return { userId }
// }

// export const ourFileRouter = {
//   courseImage: f({ image: { maxFileSize: '16MB', maxFileCount: 1 } })
//     .middleware(() => handleAuth())
//     .onUploadError(async error => {
//       console.error('[UPLOADTHING]', error)
//       await utapi.deleteFiles(error.fileKey)
//     })
//     .onUploadComplete(() => {}),
//   courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
//     .middleware(() => handleAuth())
//     .onUploadError(async error => {
//       console.error('[UPLOADTHING]', error)
//       await utapi.deleteFiles(error.fileKey)
//     })
//     .onUploadComplete(() => {}),
//   chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: '512GB' } })
//     .middleware(() => handleAuth())
//     .onUploadError(async error => {
//       console.error('[UPLOADTHING]', error)
//       await utapi.deleteFiles(error.fileKey)
//     })
//     .onUploadComplete(() => {}),
// } satisfies FileRouter

// export type OurFileRouter = typeof ourFileRouter


import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = auth();
      if (!userId) {
        console.error("Upload attempt without userId for courseImage");
        throw new Error("Unauthorized - Please sign in to upload files");
      }
      return { userId };
    })
    .onUploadComplete(async ({ metadata }) => {
      console.log("Upload completed for courseImage:", metadata);
      return { uploadedBy: metadata.userId };
    }),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async () => {
      const { userId } = auth();
      if (!userId) {
        console.error("Upload attempt without userId for courseAttachment");
        throw new Error("Unauthorized - Please sign in to upload files");
      }
      return { userId };
    })
    .onUploadComplete(async ({ metadata }) => {
      console.log("Upload completed for courseAttachment:", metadata);
      return { uploadedBy: metadata.userId };
    }),

  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(async () => {
      const { userId } = auth();
      if (!userId) {
        console.error("Upload attempt without userId for chapterVideo");
        throw new Error("Unauthorized - Please sign in to upload files");
      }
      return { userId };
    })
    .onUploadComplete(async ({ metadata }) => {
      console.log("Upload completed for chapterVideo:", metadata);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;


