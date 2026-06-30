'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: 'Client Name',
    profession: 'Profession',
    imageUrl: '/testimonial-1.jpg',
    testimonial:
      'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.',
  },
  {
    id: 2,
    name: 'Client Name',
    profession: 'Profession',
    imageUrl: '/testimonial-2.jpg',
    testimonial:
      'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.',
  },
  {
    id: 3,
    name: 'Client Name',
    profession: 'Profession',
    imageUrl: '/testimonial-3.jpg',
    testimonial:
      'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.',
  },
  {
    id: 4,
    name: 'Client Name',
    profession: 'Profession',
    imageUrl: '/testimonial-4.jpg',
    testimonial:
      'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-8">
        <h6 className="text-primary inline-block px-3 bg-white relative z-10 font-semibold">
          Testimonial
        </h6>
        <h1 className="text-3xl font-bold mt-2">Our Students Say!</h1>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-full flex-shrink-0 p-6 text-center bg-white rounded-lg shadow-lg"
              >
                <Image
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="border rounded-full mx-auto mb-4"
                />
                <h5 className="text-lg font-medium">{testimonial.name}</h5>
                <p className="text-sm text-muted-foreground mb-4">{testimonial.profession}</p>
                <div className="bg-blue-400 p-4 rounded-lg">
                  <p className="text-sm text-primary-foreground">{testimonial.testimonial}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm"
          onClick={prevTestimonial}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous testimonial</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm"
          onClick={nextTestimonial}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next testimonial</span>
        </Button>
      </div>
    </div>
  )
}