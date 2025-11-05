import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

const FileUpload = ({ onFileSelect, selectedFile, onRemove }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div>
            {!selectedFile ? (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                            ? 'border-sky-500 bg-sky-500/10'
                            : 'border-slate-700 hover:border-sky-500/50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto h-12 w-12 text-sky-400" />
                    <p className="mt-2 text-sm text-slate-300">
                        Drag and drop your resume here, or click to browse
                    </p>
                    <p className="mt-1 text-xs text-slate-400">PDF or DOCX (Max 5MB)</p>
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 bg-sky-950/50 border border-sky-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-sky-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-200">{selectedFile.name}</p>
                            <p className="text-xs text-slate-400">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onRemove}
                        className="p-1 hover:bg-red-900/30 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-red-400" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;