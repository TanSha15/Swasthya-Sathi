// src/pages/AiChecker.jsx
import React, { useState } from 'react';
import api from '../lib/axios';

const AiChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await api.post('/ai/analyze', { symptoms: [symptoms] });
      // We grab the 'assessment' object from the response!
      setAnalysis(response.data.assessment);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong connecting to the AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-textDark mb-4">
            AI Symptom <span className="text-primary">Checker</span>
          </h1>
          <p className="text-lg text-textLight">
            Describe how you are feeling, and our AI assistant will provide a preliminary analysis. 
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-soft mb-8">
          <form onSubmit={handleAnalyze}>
            <label className="block text-sm font-semibold text-textDark mb-2">
              What are your symptoms?
            </label>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4 bg-surface"
              rows="5"
              placeholder="E.g., I've had a severe headache for two days, feeling slightly dizzy..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            ></textarea>
            
            <button 
              type="submit" 
              disabled={isLoading || !symptoms.trim()}
              className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primaryDark text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-8">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-soft border-t-4 border-primary animate-fade-in-up">
            
            {/* Urgency Badge */}
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-textDark flex items-center">
                <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">🩺</span>
                AI Analysis Report
              </h2>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide
                ${analysis.urgencyLevel === 'Emergency' ? 'bg-red-100 text-red-700 border border-red-200' : 
                  analysis.urgencyLevel === 'High' ? 'bg-orange-100 text-orange-700' : 
                  'bg-green-100 text-green-700'}`}
              >
                {analysis.urgencyLevel}
              </span>
            </div>

            {/* Diagnosis & Recommendation */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-textDark mb-2">Preliminary Assessment</h3>
                <p className="text-textLight leading-relaxed">{analysis.preliminaryDiagnosis}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-md font-bold text-blue-900 mb-1">Recommendation</h3>
                <p className="text-blue-800">{analysis.recommendation}</p>
                {analysis.recommendedSpecialist && (
                  <p className="mt-2 text-sm font-semibold text-blue-700">
                    Suggested Specialist: {analysis.recommendedSpecialist}
                  </p>
                )}
              </div>

              {/* Possible Conditions Grid */}
              {analysis.possibleConditions && analysis.possibleConditions.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-textDark mb-3">Possible Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.possibleConditions.map((condition, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Red Flags Alert */}
              {analysis.redFlags && analysis.redFlags.length > 0 && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <h3 className="text-md font-bold text-red-800 mb-2 flex items-center">
                    ⚠️ Red Flags Detected
                  </h3>
                  <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                    {analysis.redFlags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-red-600 font-semibold">{analysis.urgencyReason}</p>
                </div>
              )}

            </div>
            
            {/* Disclaimer & Action Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 italic mb-6">
                {analysis.disclaimer}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <p className="text-sm font-medium text-textDark mb-4 sm:mb-0">Ready to consult a professional?</p>
                <button className="bg-secondary hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
                  Find a {analysis.recommendedSpecialist || 'Doctor'}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AiChecker;