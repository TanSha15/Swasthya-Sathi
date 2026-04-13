import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, FiActivity, FiVideo, FiUsers, 
  FiShield, FiCheckCircle, FiClock, FiStar,
  FiMail, FiPhone, FiMapPin, FiHeart
} from 'react-icons/fi';
import { FaTwitter, FaLinkedin, FaGithub, FaFacebook } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-surface min-h-screen font-sans selection:bg-primary/30 text-textDark">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left animate-fade-in-up z-10">

            <h1 className="text-5xl lg:text-7xl font-extrabold text-textDark mb-6 tracking-tight leading-[1.1]">
              Transforming <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-secondary">
                Healthcare
              </span><br/>
              For Everyone.
            </h1>
            <p className="text-lg text-textLight mb-10 max-w-xl leading-relaxed">
              Experience the next generation of patient care. Get instant AI-powered symptom analysis, connect with verified specialists via 4K telehealth, and take control of your well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primaryDark text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1">
                Get Started
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/ai-checker" className="flex items-center justify-center gap-2 bg-white text-textDark border border-gray-200 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:-translate-y-1">
                <FiActivity className="text-primary"/>
                Try AI Checker
              </Link>
            </div>
            

          </div>
          
          <div className="relative hidden lg:block z-10 w-full h-[600px]">
             {/* Abstract Dashboard/Graphic representation without external heavy images */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
             
             <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-[85%] h-[80%] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 flex flex-col gap-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                   {/* Mock UI Header */}
                   <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><FiHeart/></div>
                         <div>
                            <div className="h-3 w-24 bg-gray-200 rounded-full mb-2"></div>
                            <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                         </div>
                      </div>
                      <div className="h-8 w-20 bg-secondary/10 rounded-lg"></div>
                   </div>
                   {/* Mock UI Body */}
                   <div className="flex-1 flex gap-4">
                       {/* Sidebar List */}
                       <div className="w-1/3 bg-gray-50 rounded-2xl p-3 flex flex-col gap-3 overflow-hidden">
                          {/* Item 1 */}
                          <div className="p-2.5 w-full bg-white rounded-xl shadow-sm flex items-center gap-3">
                             <img src="https://i.pravatar.cc/100?img=33" className="w-8 h-8 rounded-full object-cover" alt="dr"/>
                             <div className="flex-1">
                                <div className="h-2 w-full max-w-[4rem] bg-gray-700 rounded-full mb-1.5"></div>
                                <div className="h-1.5 w-6 bg-gray-300 rounded-full"></div>
                             </div>
                          </div>
                          {/* Item 2 (Active) */}
                          <div className="p-2.5 w-full bg-white rounded-xl shadow-md border-l-4 border-primary flex items-center gap-3 transform scale-105 transition-transform">
                             <img src="https://i.pravatar.cc/100?img=47" className="w-8 h-8 rounded-full object-cover border-2 border-primary/20" alt="dr"/>
                             <div className="flex-1">
                                <div className="h-2 w-full max-w-[5rem] bg-primary rounded-full mb-1.5"></div>
                                <div className="h-1.5 w-8 bg-primary/40 rounded-full"></div>
                             </div>
                          </div>
                          {/* Item 3 */}
                          <div className="p-2.5 w-full bg-white rounded-xl shadow-sm flex items-center gap-3">
                             <img src="https://i.pravatar.cc/100?img=12" className="w-8 h-8 rounded-full object-cover" alt="dr"/>
                             <div className="flex-1">
                                <div className="h-2 w-full max-w-[3.5rem] bg-gray-700 rounded-full mb-1.5"></div>
                                <div className="h-1.5 w-10 bg-gray-300 rounded-full"></div>
                             </div>
                          </div>
                       </div>
                       
                       {/* Main Video Area */}
                       <div className="w-2/3 bg-gray-900 rounded-2xl p-4 flex flex-col relative overflow-hidden shadow-inner">
                          {/* Doctor Video Feed (Stock Image) */}
                          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Doctor Video Feed"/>
                          
                          {/* Gradient Overlay for Controls */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                          
                          {/* Patient PIP */}
                          <div className="absolute top-3 right-3 w-16 h-20 bg-gray-800 rounded-lg border-2 border-white/20 overflow-hidden shadow-xl z-10">
                             <img src="https://i.pravatar.cc/100?img=60" className="w-full h-full object-cover" alt="Patient Video Feed"/>
                          </div>
                          
                          {/* Call Controls */}
                          <div className="mt-auto relative z-10 flex flex-col items-center">
                             <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full mb-3 flex items-center gap-2 border border-white/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                <span className="text-white text-[10px] font-semibold tracking-wider">04:23</span>
                             </div>
                             <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-sm"><FiVideo className="w-3.5 h-3.5"/></div>
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/40 hover:bg-red-600 transition-colors"><FiPhone className="w-4 h-4" style={{transform: 'rotate(135deg)'}}/></div>
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-sm"><FiShield className="w-3.5 h-3.5"/></div>
                             </div>
                          </div>
                       </div>
                   </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
                   <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl"><FiCheckCircle/></div>
                   <div>
                      <p className="text-xs text-textLight font-medium">Dr. Available</p>
                      <p className="text-sm font-bold text-textDark">Join Call Now</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-100 bg-white/50 backdrop-blur-md">
         <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: "Active Patients", value: "15,000+" },
                 { label: "Verified Specialists", value: "500+" },
                 { label: "AI Diagnoses", value: "50,000+" },
                 { label: "Success Rate", value: "99.8%" },
               ].map((stat, i) => (
                 <div key={i} className="text-center">
                    <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primaryDark mb-2">{stat.value}</p>
                    <p className="text-sm font-medium text-textLight uppercase tracking-wider">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-surface relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Our Services</h2>
             <h2 className="text-4xl md:text-5xl font-extrabold text-textDark mb-6 leading-tight">Comprehensive Healthcare at your Fingertips</h2>
             <p className="text-lg text-textLight">Everything you need to manage your health, from preliminary diagnosis to expert consultations, seamlessly integrated into one platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-50 group">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                <FiActivity />
              </div>
              <h3 className="text-2xl font-bold text-textDark mb-4">AI Diagnostics</h3>
              <p className="text-textLight leading-relaxed mb-6">
                Describe your symptoms to our intelligent AI system and receive an instant, accurate preliminary assessment with recommended next steps.
              </p>
              <Link to="/ai-checker" className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Try it now <FiArrowRight />
              </Link>
            </div>

            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-50 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <FiVideo className="w-32 h-32" />
              </div>
              <div className="w-16 h-16 bg-emerald-50 text-secondary rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm relative z-10">
                <FiVideo />
              </div>
              <h3 className="text-2xl font-bold text-textDark mb-4 relative z-10">Telehealth Video Call</h3>
              <p className="text-textLight leading-relaxed mb-6 relative z-10">
                Skip the waiting room. Connect with certified doctors via secure, high-quality live video streaming directly in your browser.
              </p>
              <Link to="/doctors" className="text-secondary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all relative z-10">
                Find a Doctor <FiArrowRight />
              </Link>
            </div>

            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-50 group">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <FiShield />
              </div>
              <h3 className="text-2xl font-bold text-textDark mb-4">Verified Specialists</h3>
              <p className="text-textLight leading-relaxed mb-6">
                Browse our directory of thoroughly verified doctors. Book appointments based on specialties, experience, and transparent fees.
              </p>
              <Link to="/register" className="text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Join Network <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-white overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-3">Simple Process</h2>
               <h2 className="text-4xl md:text-5xl font-extrabold text-textDark">How Swasthya-Sathi Works</h2>
            </div>
            
            <div className="relative">
               {/* Connecting Line */}
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-primary/20 to-emerald-100 -translate-y-1/2"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                  {[
                     { step: "01", title: "Create Account", desc: "Sign up in seconds and build your health profile securely.", icon: <FiUsers/>, color: "text-blue-600", bg: "bg-blue-100" },
                     { step: "02", title: "Check Symptoms", desc: "Use our AI tool to understand your condition immediately.", icon: <FiActivity/>, color: "text-primary", bg: "bg-blue-50" },
                     { step: "03", title: "Consult Doctor", desc: "Book an appointment and join a live video call.", icon: <FiVideo/>, color: "text-secondary", bg: "bg-emerald-100" }
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center text-center">
                        <div className={`w-24 h-24 rounded-full ${item.bg} border-4 border-white shadow-xl flex items-center justify-center ${item.color} text-4xl mb-6 relative group hover:scale-110 transition-transform`}>
                           {item.icon}
                           <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-textDark text-white text-sm font-bold flex items-center justify-center shadow-lg">
                              {item.step}
                           </div>
                        </div>
                        <h3 className="text-2xl font-bold text-textDark mb-3">{item.title}</h3>
                        <p className="text-textLight">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
         <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-primaryDark rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10">Ready to Prioritize Your Health?</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10">
               Join thousands of others who are already experiencing modern healthcare. Sign up today and get access to top-tier medical assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
               <Link to="/register" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-gray-50">
                  Create Free Account
               </Link>
            </div>
         </div>
      </section>

      {/* Rich Footer */}
      <footer className="bg-[#0b1120] text-gray-300 pt-20 pb-10 px-6 border-t border-gray-800">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
               {/* Brand Column */}
               <div className="col-span-1 md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 font-black text-white text-2xl">
                       S
                     </div>
                     <span className="text-2xl font-bold text-white tracking-tight">Swasthya-Sathi</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed mb-6">
                     Bridging the gap between patients and healthcare providers through innovative technology, AI diagnostics, and seamless telehealth services.
                  </p>
                  <div className="flex items-center gap-4">
                     <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><FaTwitter className="text-lg"/></a>
                     <a href="https://www.linkedin.com/in/tanish-sharma-12a3382a1/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><FaLinkedin className="text-lg"/></a>
                     <a href="https://github.com/TanSha15" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"><FaGithub className="text-lg"/></a>
                     <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"><FaFacebook className="text-lg"/></a>
                  </div>
               </div>

               {/* Quick Links */}
               <div>
                  <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Quick Links</h4>
                  <ul className="space-y-4">
                     <li><Link to="/" className="hover:text-primary transition-colors flex items-center gap-2"><FiArrowRight className="text-xs"/> Home</Link></li>
                     <li><Link to="/ai-checker" className="hover:text-primary transition-colors flex items-center gap-2"><FiArrowRight className="text-xs"/> AI Checker</Link></li>
                     <li><Link to="/doctors" className="hover:text-primary transition-colors flex items-center gap-2"><FiArrowRight className="text-xs"/> Find Doctors</Link></li>
                     <li><Link to="/register" className="hover:text-primary transition-colors flex items-center gap-2"><FiArrowRight className="text-xs"/> Register</Link></li>
                  </ul>
               </div>

               {/* Contact Info */}
               <div>
                  <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Contact Us</h4>
                  <ul className="space-y-4 text-gray-400">
                     <li className="flex items-start gap-3">
                        <FiMapPin className="text-xl text-primary mt-1 flex-shrink-0"/>
                        <span>KIET Group of Institutions Ghaziabad</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <FiPhone className="text-xl text-primary flex-shrink-0"/>
                        <span>9125438488</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <FiMail className="text-xl text-primary flex-shrink-0"/>
                        <span>tanishsharma887@gmail.com</span>
                     </li>
                  </ul>
               </div>

               {/* Newsletter */}
               <div>
                  <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Newsletter</h4>
                  <p className="text-gray-400 mb-4">Subscribe to get health tips and updates.</p>
                  <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                     <input 
                        type="email" 
                        placeholder="Your email address" 
                        className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary transition-colors w-full"
                     />
                     <button type="submit" className="bg-primary hover:bg-primaryDark text-white px-4 py-3 rounded-xl font-bold transition-colors w-full flex items-center justify-center gap-2">
                        Subscribe <FiMail/>
                     </button>
                  </form>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
               <p className="text-gray-500 text-sm">
                  © 2026 Swasthya Sathi. All rights reserved.
               </p>
               <div className="flex gap-6 text-sm text-gray-500">
                  <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-gray-300 transition-colors">Cookie Settings</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;