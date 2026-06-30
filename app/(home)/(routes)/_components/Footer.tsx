import Image from 'next/image'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Youtube, Linkedin, MapPin, Phone, Mail, ChevronRight } from 'lucide-react'

const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Condition' },
  { href: '/faq', label: 'FAQs & Help' },
]

const socialLinks = [
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: 'https://facebook.com/abubakar.awan.7792/', icon: Facebook, label: 'Facebook' },
  { href: 'https://www.youtube.com/@abubakarawan2074', icon: Youtube, label: 'YouTube' },
  { href: 'https://www.linkedin.com/in/abubakar-awan-4b6502227/', icon: Linkedin, label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact</h4>
            <address className="not-italic">
              <p className="flex items-center mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                123 Street, Faisalabad, Pakistan
              </p>
              <p className="flex items-center mb-2">
                <Phone className="h-5 w-5 mr-2" />
                +92 326 5403373
              </p>
              <p className="flex items-center mb-4">
                <Mail className="h-5 w-5 mr-2" />
                sundasreman67.89@gmail.com
              </p>
            </address>
            <div className="flex space-x-2">
              {socialLinks.map((link) => (
                <Link key={link.label} href={link.href} className="p-2 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors duration-200">
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Newsletter</h4>
            <p className="mb-4">Stay updated with our latest news and offers.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p>&copy; {new Date().getFullYear()} <Link href="/" className="text-white hover:underline">CourseNet</Link>. All Rights Reserved.</p>
              <p className="text-sm mt-1">
                Designed by CourseNet
              </p>
            </div>
            <nav className="flex flex-wrap justify-center sm:justify-end gap-4">
              <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
              <Link href="/cookies" className="hover:text-white transition-colors duration-200">Cookies</Link>
              <Link href="/help" className="hover:text-white transition-colors duration-200">Help</Link>
              <Link href="/faq" className="hover:text-white transition-colors duration-200">FAQs</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}