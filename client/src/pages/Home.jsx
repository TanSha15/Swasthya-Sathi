import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-surface min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"></div>
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-primary font-semibold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Next-Gen Healthcare Technology
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-textDark mb-6 tracking-tight leading-tight">
            Your Health, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
              Our Priority.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-textLight mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the future of healthcare. Get instant AI-powered symptom analysis and seamlessly connect with top specialists via interactive telehealth consultations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary hover:bg-primaryDark text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1">
              Join as Patient
            </Link>
            <Link to="/ai-checker" className="bg-white hover:bg-gray-50 text-textDark border border-gray-200 px-8 py-4 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
              Try AI Checker
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-extrabold text-textDark mb-4">Everything You Need</h2>
             <p className="text-lg text-textLight">Comprehensive tools to manage your well-being.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-surface p-8 rounded-3xl border border-gray-100 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 bg-blue-100 text-primary rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 className="text-2xl font-bold text-textDark mb-3">AI Diagnostics</h3>
              <p className="text-textLight leading-relaxed">
                Describe your symptoms to our intelligent AI system and receive an instant, accurate preliminary assessment.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface p-8 rounded-3xl border border-gray-100 hover:border-secondary/30 transition-colors group">
              <div className="w-14 h-14 bg-emerald-100 text-secondary rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🎥
              </div>
              <h3 className="text-2xl font-bold text-textDark mb-3">Telehealth Video Call</h3>
              <p className="text-textLight leading-relaxed">
                Skip the waiting room. Connect with certified doctors via secure, high-quality live video streaming directly in your browser.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface p-8 rounded-3xl border border-gray-100 hover:border-purple-300 transition-colors group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🩺
              </div>
              <h3 className="text-2xl font-bold text-textDark mb-3">Verified Specialists</h3>
              <p className="text-textLight leading-relaxed">
                Browse our directory of thoroughly verified doctors. Book appointments based on specialties, experience, and transparent fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6 text-center">
         <p className="text-gray-400 font-medium tracking-wide">
           © 2026 Swasthya Sathi. Open Source Healthcare Platform.
         </p>
      </footer>
    </div>
  );
};

export default Home;