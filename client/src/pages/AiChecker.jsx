// src/pages/AiChecker.jsx
import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';

const AiChecker = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/history');
      setHistory(res.data.history || []);
    } catch(err) {
      console.error("Failed to load history", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await api.post('/ai/analyze', { symptoms: [symptoms] });
      setAnalysis(response.data.assessment);
      fetchHistory(); // Refresh history automatically
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong connecting to the AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPastAssessment = (pastAssessment) => {
    setAnalysis(pastAssessment.assessmentRaw);
    setSymptoms(pastAssessment.symptoms.join(', '));
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: History Panel */}
        <div className="w-full lg:w-1/3 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-2xl shadow-soft h-full max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-textDark mb-6 flex items-center gap-2">
              <span className="text-primary">🕒</span> Assessment History
            </h2>
            
            {isHistoryLoading ? (
              <div className="text-center p-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">
                No past assessments found. Describe your symptoms to generate one.
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((record) => (
                  <div 
                    key={record._id} 
                    onClick={() => loadPastAssessment(record)}
                    className="p-4 border border-gray-100 rounded-xl hover:border-primary/30 hover:bg-blue-50/50 transition-all cursor-pointer shadow-sm hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md
                          ${record.assessmentRaw?.urgencyLevel === 'Emergency' ? 'bg-red-100 text-red-700' : 
                            record.assessmentRaw?.urgencyLevel === 'High' ? 'bg-orange-100 text-orange-700' : 
                            'bg-green-100 text-green-700'}`}
                        >
                          {record.assessmentRaw?.urgencyLevel || 'Unknown'}
                       </span>
                       <span className="text-xs text-gray-400 font-medium tracking-wide">
                         {new Date(record.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <p className="font-semibold text-textDark text-sm line-clamp-2 leading-snug">
                       {record.assessmentRaw?.preliminaryDiagnosis || 'No diagnosis available'}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-50">
                       <p className="text-xs text-textLight line-clamp-1 italic">
                         <span className="font-semibold not-italic">Symp:</span> {record.symptoms.join(', ')}
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Main Checker */}
        <div className="w-full lg:w-2/3 order-1 lg:order-2">
          
          <div className="text-left mb-8">
            <h1 className="text-4xl font-extrabold text-textDark mb-3">
              AI Symptom <span className="text-primary">Checker</span>
            </h1>
            <p className="text-lg text-textLight max-w-2xl">
              Describe how you are feeling, and our AI assistant will provide a preliminary analysis securely recorded to your health history.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-soft mb-8 border border-gray-100">
            <form onSubmit={handleAnalyze}>
              <label className="block text-sm font-semibold text-textDark mb-2">
                What are your symptoms today?
              </label>
              <textarea
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4 bg-surface text-textDark"
                rows="4"
                placeholder="E.g., I've had a severe headache for two days, feeling slightly dizzy..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              ></textarea>
              
              <button 
                type="submit" 
                disabled={isLoading || !symptoms.trim()}
                className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primaryDark text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shadow-md"
              >
                {isLoading ? 'Analyzing securely...' : 'Analyze Symptoms'}
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
                  <span className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-xl mr-3 text-lg">🩺</span>
                  AI Analysis Report
                </h2>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border
                  ${analysis.urgencyLevel === 'Emergency' ? 'bg-red-50 text-red-700 border-red-200' : 
                    analysis.urgencyLevel === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                    'bg-green-50 text-green-700 border-green-200'}`}
                >
                  {analysis.urgencyLevel}
                </span>
              </div>

              {/* Diagnosis & Recommendation */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-textDark mb-2">Preliminary Assessment</h3>
                  <p className="text-textLight leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{analysis.preliminaryDiagnosis}</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <h3 className="text-md font-bold text-blue-900 mb-2">Recommendation</h3>
                  <p className="text-blue-800 leading-relaxed">{analysis.recommendation}</p>
                </div>

                {/* Possible Conditions Grid */}
                {analysis.possibleConditions && analysis.possibleConditions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-textDark mb-3">Possible Conditions Addressed</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.possibleConditions.map((condition, index) => (
                        <span key={index} className="bg-surface border border-gray-200 text-textDark px-4 py-2 rounded-lg text-sm font-semibold">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Red Flags Alert */}
                {analysis.redFlags && analysis.redFlags.length > 0 && (
                  <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                    <h3 className="text-md font-bold text-red-800 mb-3 flex items-center">
                      ⚠️ Medical Red Flags Detected
                    </h3>
                    <ul className="list-disc list-inside text-red-700 text-sm space-y-1.5">
                      {analysis.redFlags.map((flag, index) => (
                        <li key={index}>{flag}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs text-red-600 font-bold uppercase tracking-wider">{analysis.urgencyReason}</p>
                  </div>
                )}

              </div>
              
              {/* Action Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 italic mb-6">
                  {analysis.disclaimer}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <p className="text-sm font-medium text-textDark mb-4 sm:mb-0">Ready to discuss your symptoms?</p>
                  <button 
                    onClick={() => navigate('/doctors')}
                    className="bg-secondary hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-200 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
                  >
                    Consult a Doctor
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AiChecker;