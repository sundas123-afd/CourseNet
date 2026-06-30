'use client';

import { SignUp, useUser } from "@clerk/nextjs";

export default function SignUpPage() {
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <SignUp forceRedirectUrl='/save-user-info'/>
    </div>
  );
}
