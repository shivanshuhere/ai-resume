import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resumeText: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    atsScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    skills: [
        {
            type: String,
        },
    ],
    strengths: [
        {
            type: String,
        },
    ],
    weaknesses: [
        {
            type: String,
        },
    ],
    suggestions: [
        {
            type: String,
        },
    ],
    jobDescription: {
        type: String,
        default: null,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
    },
    missingSkills: [
        {
            type: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Analysis", analysisSchema);
