const ScoreCircle = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                        cx="64"
                        cy="64"
                        r="45"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="45"
                        stroke={getColor(score)}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: getColor(score) }}>
                        {score}
                    </span>
                </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 font-medium">{label}</p>
        </div>
    );
};

export default ScoreCircle;