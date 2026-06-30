"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Shield, GraduationCap, User, BookOpen, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export type User = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  numberOfCourses: number;
  courses: any[];
  role: 'admin' | 'teacher' | 'student' | 'teacher-student' | 'visitor';
  isTeacher: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const getRoleBadge = (role: string) => {
  const roleConfig = {
    admin: { 
      label: 'Admin', 
      variant: 'destructive' as const, 
      icon: Shield,
      description: 'System administrator'
    },
    teacher: { 
      label: 'Teacher', 
      variant: 'default' as const, 
      icon: GraduationCap,
      description: 'Creates courses'
    },
    student: { 
      label: 'Student', 
      variant: 'secondary' as const, 
      icon: User,
      description: 'Enrolled in courses'
    },
    'teacher-student': { 
      label: 'Teacher + Student', 
      variant: 'default' as const, 
      icon: BookOpen,
      description: 'Creates and enrolls in courses'
    },
    visitor: { 
      label: 'Visitor', 
      variant: 'outline' as const, 
      icon: Eye,
      description: 'No activity yet'
    }
  };

  return roleConfig[role as keyof typeof roleConfig] || roleConfig.visitor;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      const roleConfig = getRoleBadge(user.role);
      const Icon = roleConfig.icon;
      
      return (
        <div className="flex items-center gap-2">
          <Badge variant={roleConfig.variant} className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            {roleConfig.label}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "numberOfCourses",
    header: "Courses Created",
    cell: ({ row }) => {
      const numberOfCourses = row.original.numberOfCourses;
      return <div className="text-center">{numberOfCourses ?? 0}</div>;
    },
  },
  {
    accessorKey: "courses",
    header: "Courses Enrolled",
    cell: ({ row }) => {
      const enrolledCourses = row.original.courses?.length || 0;
      return (
        <div className="text-center">
          <Badge variant={enrolledCourses > 0 ? "default" : "secondary"}>
            {enrolledCourses}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user.role === 'teacher' ? (
              <Link href={`/admin/${user.userId}`}>
                <DropdownMenuItem>See courses created</DropdownMenuItem>
              </Link>
            ) : user.role === 'student' ? (
              <Link href={`/admin/${user.userId}`}>
                <DropdownMenuItem>See enrolled courses</DropdownMenuItem>
              </Link>
            ) : user.role === 'teacher-student' ? (
              <>
                <Link href={`/admin/${user.userId}?view=created`}>
                  <DropdownMenuItem>See courses created</DropdownMenuItem>
                </Link>
                <Link href={`/admin/${user.userId}?view=enrolled`}>
                  <DropdownMenuItem>See enrolled courses</DropdownMenuItem>
                </Link>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
