import { Link } from 'react-router-dom';
import { FileText, Calendar, TrendingUp, ChevronRight } from 'lucide-react';

const AnalysisCard = ({ analysis }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <Link
            to={`/analysis/${analysis._id}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-primary-100 rounded-lg">
                        <FileText className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{analysis.fileName}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(analysis.createdAt)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{analysis.skills.length} skills</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(analysis.atsScore)}`}>
                        {analysis.atsScore}%
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </Link>
    );
};

export default AnalysisCard;