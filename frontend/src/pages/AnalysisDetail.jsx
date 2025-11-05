import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import ScoreCircle from '../components/ScoreCircle';
import {
    ArrowLeft,
    FileText,
    Target,
    TrendingUp,
    TrendingDown,
    Lightbulb,
    Briefcase,
    Loader,
    Trash2,
    CheckCircle
} from 'lucide-react';

const AnalysisDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jobDescription, setJobDescription] = useState('');
    const [matchResult, setMatchResult] = useState(null);
    const [matchLoading, setMatchLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchAnalysis();
    }, [id]);

    const fetchAnalysis = async () => {
        try {
            const response = await api.get(`api/resume/analysis/${id}`);
            setAnalysis(response.data.data);
            if (response.data.data.matchScore) {
                setMatchResult({
                    matchScore: response.data.data.matchScore,
                    missingSkills: response.data.data.missingSkills
                });
            }
        } catch (error) {
            console.error('Failed to fetch analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMatchJob = async () => {
        if (!jobDescription.trim()) return;

        setMatchLoading(true);
        try {
            const response = await api.post(`api/resume/match-job/${id}`, { jobDescription });
            setMatchResult(response.data.data);
        } catch (error) {
            console.error('Job matching failed:', error);
        } finally {
            setMatchLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this analysis?')) return;

        setDeleteLoading(true);
        try {
            await api.delete(`api/resume/analysis/${id}`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to delete analysis:', error);
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <p className="text-slate-400">Analysis not found</p>
                <Link to="/dashboard" className="mt-4 text-sky-400 hover:text-sky-300">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex items-center justify-between">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-200"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="inline-flex items-center px-4 py-2 border border-red-800/50 rounded-md text-sm font-medium text-red-400 hover:bg-red-900/30 disabled:opacity-50"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700/50 shadow-lg p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-200">{analysis.fileName}</h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Analyzed on {new Date(analysis.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <ScoreCircle score={analysis.atsScore} label="ATS Score" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <Target className="h-5 w-5 text-sky-400" />
                                <h2 className="text-lg font-semibold text-slate-200">Skills Detected</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-sky-500/10 text-sky-400 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                                <h2 className="text-lg font-semibold text-slate-200">Strengths</h2>
                            </div>
                            <ul className="space-y-2">
                                {analysis.strengths.map((strength, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <TrendingDown className="h-5 w-5 text-red-400" />
                                <h2 className="text-lg font-semibold text-slate-200">Weaknesses</h2>
                            </div>
                            <ul className="space-y-2">
                                {analysis.weaknesses.map((weakness, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <span className="h-5 w-5 flex items-center justify-center text-red-400 flex-shrink-0">
                                            •
                                        </span>
                                        <span className="text-slate-300">{weakness}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <Lightbulb className="h-5 w-5 text-amber-400" />
                                <h2 className="text-lg font-semibold text-slate-200">Suggestions</h2>
                            </div>
                            <ul className="space-y-2">
                                {analysis.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <span className="text-amber-400 flex-shrink-0">{index + 1}.</span>
                                        <span className="text-slate-300">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700/50 shadow-lg p-8">
                <div className="flex items-center space-x-2 mb-4">
                    <Briefcase className="h-5 w-5 text-sky-400" />
                    <h2 className="text-lg font-semibold text-slate-200">Job Description Matching</h2>
                </div>

                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to see how well your resume matches..."
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-md shadow-sm text-slate-200 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
                />

                <button
                    onClick={handleMatchJob}
                    disabled={!jobDescription.trim() || matchLoading}
                    className="mt-4 inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                    {matchLoading ? (
                        <>
                            <Loader className="animate-spin mr-2 h-5 w-5" />
                            Analyzing Match...
                        </>
                    ) : (
                        'Match with Job'
                    )}
                </button>

                {matchResult && (
                    <div className="mt-6 p-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-200">Match Results</h3>
                            <ScoreCircle score={matchResult.matchScore} label="Match Score" />
                        </div>

                        {matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-slate-300 mb-2">Missing Skills:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {matchResult.missingSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {matchResult.matchedSkills && matchResult.matchedSkills.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-slate-300 mb-2">Matched Skills:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {matchResult.matchedSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {matchResult.recommendations && matchResult.recommendations.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-slate-300 mb-2">Recommendations:</h4>
                                <ul className="space-y-2">
                                    {matchResult.recommendations.map((rec, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-sm text-slate-400">
                                            <span className="text-sky-400">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisDetail;