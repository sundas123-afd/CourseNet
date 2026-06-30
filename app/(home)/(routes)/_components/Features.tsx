import { FaGraduationCap, FaGlobe, FaHome, FaBookOpen } from 'react-icons/fa';

const Features = () => {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-10">Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="group service-item text-center p-6 bg-blue-200 shadow-lg rounded-lg transition-all duration-500 hover:mt-[-10px] hover:bg-blue-400">
            <div className="flex justify-center items-center mb-4 text-primary text-5xl transition-all duration-500 group-hover:text-light">
              <FaGraduationCap />
            </div>
            <h5 className="text-xl font-semibold mb-3 transition-all duration-500 group-hover:text-light">
              Expert Instructors
            </h5>
            <p className="text-gray-500 transition-all duration-500 group-hover:text-light">
              Learn from top professionals in their fields, bringing real-world experience into every lesson.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group service-item text-center p-6 bg-blue-200 shadow-lg rounded-lg transition-all duration-500 hover:mt-[-10px] hover:bg-blue-400">
            <div className="flex justify-center items-center mb-4 text-primary text-5xl transition-all duration-500 group-hover:text-light">
              <FaGlobe />
            </div>
            <h5 className="text-xl font-semibold mb-3 transition-all duration-500 group-hover:text-light">
              Global Access
            </h5>
            <p className="text-gray-500 transition-all duration-500 group-hover:text-light">
              Access high-quality courses from anywhere in the world, anytime that fits your schedule.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group service-item text-center p-6 bg-blue-200 shadow-lg rounded-lg transition-all duration-500 hover:mt-[-10px] hover:bg-blue-400">
            <div className="flex justify-center items-center mb-4 text-primary text-5xl transition-all duration-500 group-hover:text-light">
              <FaHome />
            </div>
            <h5 className="text-xl font-semibold mb-3 transition-all duration-500 group-hover:text-light">
              Learn at Home
            </h5>
            <p className="text-gray-500 transition-all duration-500 group-hover:text-light">
              Enjoy the flexibility of learning from the comfort of your home, without the need to commute.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group service-item text-center p-6 bg-blue-200 shadow-lg rounded-lg transition-all duration-500 hover:mt-[-10px] hover:bg-blue-400">
            <div className="flex justify-center items-center mb-4 text-primary text-5xl transition-all duration-500 group-hover:text-light">
              <FaBookOpen />
            </div>
            <h5 className="text-xl font-semibold mb-3 transition-all duration-500 group-hover:text-light">
              Cutting-Edge Technology
            </h5>
            <p className="text-gray-500 transition-all duration-500 group-hover:text-light">
              Stay ahead of the curve with courses designed around the latest trends and technologies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
