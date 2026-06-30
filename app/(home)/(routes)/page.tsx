import React from 'react'
import About from "./_components/AboutUs"
import Features from "./_components/Features"
import Footer from "./_components/Footer"
import HeroSection from "./_components/HeroSection"
// import TeachOnCourseNet from "./_components/TeachOnCoursenet"
import Testimonials from './_components/testimonials'

export default function Component() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <Features />
      <About />
      <Testimonials />
      {/* <TeachOnCourseNet /> */}
      <Footer />
    </main>
  )
}