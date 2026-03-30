import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-textDark mb-4 tracking-tight">
          Your Health, <span className="text-primary">Our Priority</span>
        </h1>
        <p className="text-lg text-textLight mb-8">
          AI-powered symptom checking and seamless telehealth consultations.
        </p>
        <button className="bg-primary hover:bg-primaryDark text-white px-8 py-3 rounded-full font-semibold transition-all shadow-soft">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;