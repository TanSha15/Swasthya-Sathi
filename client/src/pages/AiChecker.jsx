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
      const errorMsg = err.response?.data?.message || 'Something went wrong connecting to the AI.';
      if (err.response?.status === 401 || errorMsg.toLowerCase().includes('not authorized') || errorMsg.toLowerCase().includes('no token')) {
        setError('UNAUTHORIZED');
      } else {
        setError(errorMsg);
      }
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
        <div className="w-full lg:w-[350px] flex-shrink-0 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-3xl shadow-soft h-full max-h-[85vh] overflow-y-auto custom-scrollbar border border-gray-50">
            <h2 className="text-xl font-bold text-textDark mb-6 flex items-center gap-3">
              <span className="text-primary bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-xl">🕒</span> Assessment History
            </h2>
            
            {isHistoryLoading ? (
              <div className="text-center p-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4 grayscale opacity-60 shadow-inner">📂</div>
                <p className="text-gray-400 text-sm font-bold">No history available</p>
                <p className="text-gray-400 text-xs mt-1 px-4">Your detailed AI assessments will automatically save here.</p>
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
        <div className="w-full lg:flex-1 order-1 lg:order-2">
          
          <div className="mb-10">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary font-bold text-sm mb-5 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                Powered by Advanced AI
             </div>
             <h1 className="text-4xl lg:text-5xl font-extrabold text-textDark mb-4 tracking-tight">
               AI Symptom <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Checker</span>
             </h1>
             <p className="text-textLight text-lg max-w-2xl leading-relaxed">
               Describe how you are feeling in natural language. Our intelligent system will analyze your symptoms and securely log a preliminary health report.
             </p>
          </div>

          {/* Input Section */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-soft mb-8 border border-gray-50 relative">
            <form onSubmit={handleAnalyze}>
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold text-xl shadow-inner border border-blue-100/50">🤖</div>
                 <label className="block text-xl font-bold text-textDark tracking-tight">
                   How are you feeling today?
                 </label>
              </div>
              <textarea
                className="w-full p-5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary resize-none mb-6 bg-surface/50 text-textDark text-lg transition-all shadow-inner"
                rows="5"
                placeholder="E.g., I've had a severe headache for two days, feeling slightly dizzy when I stand up quickly..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              ></textarea>
              
              <div className="flex justify-end">
                 <button 
                   type="submit" 
                   disabled={isLoading || !symptoms.trim()}
                   className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-primaryDark hover:to-indigo-800 text-white font-extrabold rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
                 >
                   {isLoading ? 'Analyzing securely...' : 'Analyze Symptoms'}
                 </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error === 'UNAUTHORIZED' ? (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in-up">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-2xl shadow-sm border border-amber-200/50">🔒</div>
                <div>
                  <h3 className="text-amber-900 font-bold text-lg mb-1">Authentication Required</h3>
                  <p className="text-amber-800 font-medium text-sm">
                    You need to securely log in to access the AI Symptom Checker.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto whitespace-nowrap bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-5 rounded-2xl mb-8 flex items-center gap-3 shadow-sm">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-red-700 font-bold">{error}</p>
            </div>
          ) : null}

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