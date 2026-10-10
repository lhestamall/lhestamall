import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet the Founder | LhestaMall",
  description: "Learn about Andrews Amankwah, the founder of LhestaMall, his engineering background, and his vision.",
};

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-(--color-bg) pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-zinc-900 overflow-hidden">
        <Image 
          src="/images/founder/1000241154.jpg" 
          alt="Andrews Amankwah" 
          fill 
          style={{ objectPosition: "center 45g%" }}
          className="object-cover opacity-40 mix-blend-overlay"
          priority
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Meet the Founder</h1>
          <p className="text-xl md:text-3xl font-light text-zinc-200 mb-6">
            Andrews Amankwah
          </p>
          <div className="h-1 w-24 bg-zinc-400 mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light">
            Electrical engineering professional, entrepreneur, and the visionary behind LhestaMall.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 flex flex-col lg:flex-row gap-16">
        
        {/* Left Column: Story */}
        <div className="lg:w-2/3 space-y-16">
          
          <section>
            <h2 className="text-3xl font-semibold mb-6 tracking-tight">About Andrews Amankwah</h2>
            <div className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-5">
              <p>
                Andrews Amankwah is an electrical engineering professional from Ghana whose interests include industrial electrical systems, power systems, automation, equipment maintenance, and technological development.
              </p>
              <p>
                His journey combines technical education, practical industrial experience, public service, leadership, and entrepreneurship. He is particularly interested in understanding how electrical systems and industrial machines operate, identifying the causes of equipment failures, and applying engineering principles to improve reliability, efficiency, and operational performance.
              </p>
              <p>
                Through his work and continued professional development, Andrews seeks to strengthen his technical capabilities and contribute to the advancement of industrial technology in Ghana. Beyond engineering, he has an interest in digital business development, entrepreneurship, and the use of technology to create opportunities.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-8 tracking-tight">Educational Background</h2>
            <div className="space-y-8">
              
              <div className="relative pl-6 border-l-4 border-zinc-800 dark:border-zinc-200">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Bachelor of Technology in Electrical and Electronics Engineering</h3>
                <p className="text-sm font-medium text-zinc-500 mb-3 mt-1 uppercase tracking-wider">Accra Technical University (Completed Nov 2025)</p>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  His studies strengthened his understanding of electrical engineering principles and their applications in industrial and technological environments. His academic interests include electrical power systems, industrial automation, motor control, electrical equipment, and maintenance engineering. The programme also provided an opportunity to connect theoretical knowledge with practical engineering challenges.
                </p>
              </div>

              <div className="relative pl-6 border-l-4 border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Higher National Diploma in Electrical and Electronics Engineering</h3>
                <p className="text-sm font-medium text-zinc-500 mb-3 mt-1 uppercase tracking-wider">Kumasi Technical University (Completed 2022)</p>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  This qualification provided a foundation for his further studies and professional development. His HND training helped develop his technical understanding of electrical systems and prepared him for further academic work and industrial experience.
                </p>
              </div>

              <div className="relative pl-6 border-l-4 border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Technical Education</h3>
                <p className="text-sm font-medium text-zinc-500 mb-3 mt-1 uppercase tracking-wider">St. Paul’s Technical School, Kukurantumi</p>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Andrews began his technical education studying Electrical Engineering Technology. This early education introduced him to the technical principles that would later shape his academic and professional direction. His educational progression reflects a continued commitment to developing his knowledge and practical abilities in electrical engineering.
                </p>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 tracking-tight">Professional Career</h2>
            <div className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-5">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Electrical Technician and Maintenance Officer</h3>
                <p className="text-zinc-500 font-medium">PRAK Industries Ltd</p>
              </div>
              <p>
                Andrews currently works as an Electrical Technician and Maintenance Officer at PRAK Industries Ltd. His responsibilities involve supporting the maintenance, troubleshooting, and optimization of industrial electrical systems to help ensure reliable and efficient plant operations.
              </p>
              <p>
                Working in an industrial production environment requires the ability to investigate electrical faults, understand control systems, assess equipment performance, and support preventive maintenance activities.
              </p>
              
              <div className="mt-8 mb-4">
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Technical Responsibilities & Experience:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-2">▹</span>
                    <span>Industrial electrical maintenance and fault diagnosis.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-2">▹</span>
                    <span>Preventive maintenance and equipment reliability.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-2">▹</span>
                    <span>Programmable Logic Controllers (PLCs) and industrial automation.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-2">▹</span>
                    <span>Variable Frequency Drives (VFDs) and inverter systems.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-2">▹</span>
                    <span>Servo drives and motor control systems.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-2">▹</span>
                    <span>Electrical control panels and panel wiring.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-2">▹</span>
                    <span>Sensors, actuators, and industrial control systems.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-2">▹</span>
                    <span>Electrical testing and troubleshooting.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-2">▹</span>
                    <span>Maintenance of industrial production machinery.</span>
                  </li>
                </ul>
              </div>
              
              <p>
                These areas represent important aspects of his technical work and professional interests. Through his role, Andrews continues to develop practical problem-solving skills while contributing to the reliable operation of industrial equipment. His work also reinforces the importance of preventive maintenance, systematic fault investigation, and continuous technical improvement in manufacturing environments.
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-3xl font-semibold mb-6 tracking-tight">Entrepreneurship & Digital Business</h2>
            <div className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-5">
               <p>
                 Beyond his engineering career, Andrews has an interest in entrepreneurship and digital business development. His involvement in LhestaMall reflects his interest in e-commerce, online product promotion, and the use of digital platforms to support business activities.
               </p>
               <p>
                 The platform originated from his interest in mini-importation and online commerce, with the broader ambition of developing an online shopping platform serving customers through digital channels.
               </p>
               <p>
                 His entrepreneurial activities have exposed him to areas such as product promotion, customer engagement, online marketing, and business development. He is also interested in how technology can create opportunities for businesses and individuals in Ghana. This combination of engineering and entrepreneurship reflects his broader interest in practical problem-solving, innovation, and technology-driven development.
               </p>
            </div>
          </section>

          <section>
            <div className="bg-zinc-900 text-white dark:bg-zinc-800 p-8 md:p-10 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-semibold mb-6">Vision & Professional Goals</h2>
              <div className="text-lg leading-relaxed text-zinc-300 space-y-5">
                <p>
                  Andrews aims to continue developing his expertise in electrical engineering, industrial maintenance, automation, and related technologies. He is interested in applying engineering solutions that improve equipment reliability, strengthen maintenance practices, and support efficient industrial operations.
                </p>
                <p>
                  He also values opportunities to acquire new knowledge, develop professionally, and contribute to technological progress in Ghana. Alongside his technical career, he remains interested in entrepreneurship and the use of digital platforms to create sustainable business opportunities.
                </p>
                <p className="text-xl font-medium text-white mt-8 pt-6 border-t border-zinc-700">
                  "His long-term professional outlook emphasizes continuous learning, practical innovation, and the application of technical knowledge to real-world challenges."
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Sidebar / Images / Highlights */}
        <div className="lg:w-1/3 space-y-10">
          
          <div className="rounded-3xl overflow-hidden aspect-[4/5] relative shadow-2xl">
             <Image 
               src="/images/founder/1000241150.jpg" 
               alt="Andrews Amankwah Portrait" 
               fill 
               style={{ objectPosition: "center 15%" }}
               className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
             />
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Other Experience & Training</h3>
            
            <div className="space-y-8">
              <div className="relative pl-5">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
                <h4 className="font-semibold text-zinc-900 dark:text-white">Industrial Experience (VRA)</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Internship and industrial attachment at the Volta River Authority (VRA), gaining practical exposure to the electricity sector, equipment operations, and maintenance principles.
                  <span className="block mt-2 text-xs italic text-zinc-400">*Dates to be confirmed.</span>
                </p>
              </div>
              
              <div className="relative pl-5">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
                <h4 className="font-semibold text-zinc-900 dark:text-white">National Service Leadership</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Served as Financial Secretary for the National Service Secretariat in the Ga Central Municipality, receiving a certificate for financial coordination and administrative leadership.
                </p>
              </div>

              <div className="relative pl-5">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
                <h4 className="font-semibold text-zinc-900 dark:text-white">Public Service & Civic Ed.</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Served as a Civic Educator with the National Commission for Civic Education (NCCE), focusing on civic awareness, public education, and community engagement.
                </p>
              </div>

              <div className="relative pl-5">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
                <h4 className="font-semibold text-zinc-900 dark:text-white">Quality Systems & Food Safety</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Participated in a 2025 program organized by the Mastercard Foundation’s Nkabom Collaborative with McGill University and AGI.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden aspect-square relative shadow-xl">
             <Image 
               src="/images/founder/IMG-20261010-WA0005.jpg" 
               alt="Andrews in action" 
               fill 
               style={{ objectPosition: "center 15%" }}
               className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
             />
          </div>
          
        </div>
      </div>
    </div>
  );
}
