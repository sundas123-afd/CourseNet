'use client';

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { SearchInput } from "./search-input";
import { Button } from "@/components/ui/button";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isSearchPage = pathname === '/search';
  const isCoursePage = pathname?.includes("/courses");
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isStudentPage = pathname?.startsWith("/student");
  const isAdminPage = pathname?.startsWith("/admin");

  const isAdminUser = isAdmin(userId ?? null); // Check if the user is an admin

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex ml-auto gap-x-2">
        {isStudentPage || isSearchPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Exit</span>
            </Button>
          </Link>
        ) : (
          <Link href="/student">
            <Button size="sm" variant="ghost">
              Student Mode
            </Button>
          </Link>
        )}

        {isTeacherPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Exit</span>
            </Button>
          </Link>
        ) : (
          <Link href="/teacher">
            <Button size="sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        )}

        {isAdminUser && (
          isAdminPage ? (
            <Link href="/">
              <Button size="sm" variant="ghost">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Exit</span>
              </Button>
            </Link>
          ) : (
            <Link href="/admin">
              <Button size="sm" variant="ghost">
                Admin Panel
              </Button>
            </Link>
          )
        )}

        <UserButton />
      </div>
    </>
  );
};
