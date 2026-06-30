import Image from 'next/image';

export default function TeachOnCourseNet() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <Image
            className="rounded-lg shadow-lg"
            src="/teacher.jpg"
            alt="Instructor teaching"
            width={600}
            height={450}
            loading="lazy"
          />
        </div>
        <div className="w-full md:w-1/2 md:pl-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Become an Instructor
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Instructors from around the world teach millions of learners on
            CourseNet. We provide the tools and skills to teach what you love.
          </p>
          <a
            href="/teacher.jpg"
            className="inline-block bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-500 transition duration-200"
          >
            Start Teaching Today
          </a>
        </div>
      </div>
    </section>
  );
}
