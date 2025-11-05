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
        if (score >= 80) return 'text-emerald-400 bg-emerald-500/10';
        if (score >= 60) return 'text-amber-400 bg-amber-500/10';
        return 'text-red-400 bg-red-500/10';
    };

    return (
        <Link
            to={`/analysis/${analysis._id}`}
            className="block bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700/50 shadow-lg hover:bg-slate-700/50 transition-colors p-6"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-sky-500/10 rounded-lg">
                        <FileText className="h-6 w-6 text-sky-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-200 truncate">{analysis.fileName}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
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
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
            </div>
        </Link>
    );
};

export default AnalysisCard;