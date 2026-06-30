import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center text-white overflow-hidden">
      <Image
        src="/bg1.jpg"
        alt="Background"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-300 mb-4 animate-fade-in-up">
            WELCOME TO COURSENET
          </h3>
          <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up animation-delay-200">
            Unlock Your Potential with Expert-Led Online Education
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 animate-fade-in-up animation-delay-400">
            Embark on a transformative learning journey with CourseNet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
            <Link
              href="/student"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Explore Courses <FaArrowRight className="ml-2" />
            </Link>
            <Link
              href="/teacher/courses"
              className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Become an Instructor <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
