'use client'

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { UserButton } from "@clerk/nextjs"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const Links = [
    { name: "Home", link: "/" },
    { name: "Courses", link: "/student" },
    { name: "Teacher", link: "/teacher/courses" },
    { name: "Contact", link: "/contactUs" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`w-full transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary transition-colors duration-300 hover:text-blue-600">
              CourseNet
            </Link>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {Links.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <Link href={link.link} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {link.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center space-x-4">
              <UserButton />
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <nav className="bg-white shadow-lg">
            {Links.map((link) => (
              <Link
                key={link.name}
                href={link.link}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main className="flex-grow relative">
        {children}
      </main>
    </div>
  )
}

export default Layout