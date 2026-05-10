import { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertTriangle, Lightbulb, Search, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const ResumeAI = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [activeTab, setActiveTab] = useState('analyze');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!file) {
      return toast.error('Please upload a resume');
    }

    if (!jobDescription.trim()) {
      return toast.error('Please paste a job description');
    }

    setLoading(true);

    const formData = new FormData();

    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/analyze`,
        formData
      );

      setAnalysis(data.aiAnalysis);

      toast.success('Analysis complete!');

    } catch (error) {

      toast.error('Analysis failed');

    } finally {

      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription) return toast.error('Please paste a job description');

    setLoading(true);
    const formData = new FormData();
    if (file) formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/resume/cover-letter`, formData);
      setCoverLetter(data.coverLetter);
      toast.success('Cover letter generated!');
    } catch (error) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex space-x-4 border-b border-white/10 mb-8">
        <button
          onClick={() => setActiveTab('analyze')}
          className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'analyze' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}
        >
          Resume Analyzer
        </button>
        <button
          onClick={() => setActiveTab('cover-letter')}
          className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'cover-letter' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}
        >
          Cover Letter Generator
        </button>
      </div>

      {activeTab === 'analyze' ? (
        <div className="space-y-8">
          <div className="glass-card p-8 text-center">
            <input type="file" id="resume-upload" className="hidden" onChange={handleFileChange} accept=".pdf" />
            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-500/10 rounded-full text-blue-400">
                <Upload size={40} />
              </div>
              <div>
                <p className="text-xl font-semibold">{file ? file.name : 'Upload your Resume (PDF)'}</p>
                <p className="text-gray-400">AI will analyze and provide improvements</p>
              </div>
            </label>
            <div className="mt-8 text-left">
              <label className="block text-lg font-semibold mb-3 text-white">
                Job Description
              </label>

              <textarea
                className="input-field h-48 resize-none"
                placeholder="Paste the job description here for ATS comparison..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            {file && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="btn-primary mt-6 px-8 py-3"
              >
                {loading ? 'Analyzing...' : 'Start AI Analysis'}
              </button>
            )}
          </div>

          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 glass-card p-6 flex flex-col items-center justify-center text-center">
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-navy-700" />
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray={377} strokeDashoffset={377 - (377 * analysis.score) / 100}
                      className="text-blue-500" />
                  </svg>
                  <span className="absolute text-3xl font-bold">{analysis.score}</span>
                </div>
                <h3 className="text-xl font-bold">Overall Score</h3>
                <p className="text-gray-400 mt-2">{analysis.summary}</p>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="glass-card p-6">
                  <h3 className="flex items-center space-x-2 text-lg font-bold mb-4 text-green-400">
                    <CheckCircle size={20} /> <span>Strengths</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="glass-card p-6">
                  <h3 className="flex items-center space-x-2 text-lg font-bold mb-4 text-red-400">
                    <AlertTriangle size={20} /> <span>Weaknesses</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>

              <div className="md:col-span-3 glass-card p-6">
                <h3 className="flex items-center space-x-2 text-lg font-bold mb-6 text-blue-400">
                  <Lightbulb size={20} /> <span>AI-Improved Bullet Points</span>
                </h3>
                <div className="space-y-6">
                  {analysis.improvedBullets.map((item, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-navy-700/30 rounded-lg border border-white/5">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Original</p>
                        <p className="text-gray-400 italic">"{item.original}"</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-500 uppercase mb-2">AI Improved</p>
                        <p className="text-white font-medium">"{item.improved}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3 glass-card p-6">
                <h3 className="flex items-center space-x-2 text-lg font-bold mb-4 text-purple-400">
                  <Search size={20} /> <span>Missing ATS Keywords</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-4">Job Description</h3>
            <textarea
              className="input-field h-48 mb-6 resize-none"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <input type="file" id="resume-cl" className="hidden" onChange={handleFileChange} accept=".pdf" />
                <label htmlFor="resume-cl" className="cursor-pointer flex items-center space-x-2 text-blue-400 hover:underline">
                  <Upload size={18} />
                  <span>{file ? file.name : 'Upload Resume'}</span>
                </label>
              </div>
              <button
                onClick={handleGenerateCoverLetter}
                disabled={loading}
                className="btn-primary px-8 py-3 w-full md:w-auto"
              >
                {loading ? 'Generating...' : 'Generate Cover Letter'}
              </button>
            </div>
          </div>

          {coverLetter && (
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Generated Cover Letter</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { navigator.clipboard.writeText(coverLetter); toast.success('Copied!'); }}
                    className="p-2 hover:bg-navy-700 rounded-lg text-gray-400"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-navy-900/50 p-6 rounded-lg border border-white/10 whitespace-pre-wrap text-gray-300 leading-relaxed">
                {coverLetter}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAI;
