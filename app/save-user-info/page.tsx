'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveUserInfoPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || isSaving) return;

    const saveUserInfo = async () => {
      try {
        setIsSaving(true);
        setError("");

        const { id: userId, username, firstName, lastName, emailAddresses } = user;
        const email = emailAddresses[0]?.emailAddress || "";
        const finalUsername = username || [firstName, lastName].filter(Boolean).join(" ") || email.split("@")[0];

        const response = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            username: finalUsername,
            email,
            numberOfCourses: 0,
            courses: [],
          }),
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || "Failed to save user info");
        }

        router.push("/"); // Redirect after successful save
      } catch (error) {
        setError("An error occurred while saving user information");
      } finally {
        setIsSaving(false);
      }
    };

    saveUserInfo();
  }, [isLoaded, isSignedIn, user]); // Removed isSaving and router from dependencies

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <p>Saving your information...</p>
      {isSaving && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <p>Saving your information...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
