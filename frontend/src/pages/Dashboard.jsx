import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AnalysisCard from '../components/AnalysisCard';
import { Upload, FileText, TrendingUp, Target } from 'lucide-react';

const Dashboard = () => {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        avgScore: 0,
        highestScore: 0
    });

    useEffect(() => {
        fetchAnalyses();
    }, []);

    const fetchAnalyses = async () => {
        try {
            const response = await api.get('api/resume/my-analyses');
            const data = response.data.data;
            setAnalyses(data);

            if (data.length > 0) {
                const avgScore = Math.round(
                    data.reduce((sum, a) => sum + a.atsScore, 0) / data.length
                );
                const highestScore = Math.max(...data.map(a => a.atsScore));
                setStats({
                    total: data.length,
                    avgScore,
                    highestScore
                });
            }
        } catch (error) {
            console.error('Failed to fetch analyses:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">Dashboard</h1>
                <p className="mt-2 text-slate-400">Track and manage your resume analyses</p>
            </div>

            {analyses.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="mx-auto h-16 w-16 text-slate-500" />
                    <h3 className="mt-4 text-lg font-medium text-slate-200">No analyses yet</h3>
                    <p className="mt-2 text-sm text-slate-400">
                        Get started by uploading your resume for analysis
                    </p>
                    <Link
                        to="/upload"
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Resume
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700/50 shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-sky-500/10 rounded-lg">
                                    <FileText className="h-6 w-6 text-sky-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-400">Total Analyses</p>
                                    <p className="text-2xl font-bold text-slate-200">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700/50 shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-amber-500/10 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-amber-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-400">Average Score</p>
                                    <p className="text-2xl font-bold text-slate-200">{stats.avgScore}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700/50 shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-emerald-500/10 rounded-lg">
                                    <Target className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-400">Highest Score</p>
                                    <p className="text-2xl font-bold text-slate-200">{stats.highestScore}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-slate-200">Recent Analyses</h2>
                            <Link
                                to="/upload"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                New Analysis
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {analyses.map((analysis) => (
                                <AnalysisCard key={analysis._id} analysis={analysis} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;