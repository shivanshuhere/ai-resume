import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import FileUpload from '../components/FileUpload';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
        setError('');
        setSuccess(false);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await api.post('api/resume/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess(true);
            setTimeout(() => {
                navigate(`/analysis/${response.data.data.id}`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">Upload Resume</h1>
                    <p className="mt-2 text-slate-400">
                        Upload your resume to get AI-powered analysis and insights
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700/50 shadow-lg p-8">
                    <FileUpload
                        onFileSelect={handleFileSelect}
                        selectedFile={file}
                        onRemove={handleRemoveFile}
                    />

                    {error && (
                        <div className="mt-4 bg-red-900/30 border border-red-800/50 rounded-md p-4 flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 bg-green-900/30 border border-green-800/50 rounded-md p-4 flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-300">
                                Resume analyzed successfully! Redirecting...
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin mr-2 h-5 w-5" />
                                Analyzing Resume...
                            </>
                        ) : (
                            'Analyze Resume'
                        )}
                    </button>

                    <div className="mt-6 bg-slate-700/30 border border-slate-600/50 rounded-md p-4">
                        <h3 className="text-sm font-medium text-sky-400 mb-2">What you'll get:</h3>
                        <ul className="text-sm text-slate-300 space-y-1">
                            <li>• ATS compatibility score (0-100)</li>
                            <li>• Extracted skills and technologies</li>
                            <li>• Resume strengths and weaknesses</li>
                            <li>• Actionable improvement suggestions</li>
                            <li>• Job description matching (optional)</li>
                        </ul>
                    </div>
                </div>
            </div>
            );
        </div>
    );
};

export default Upload;