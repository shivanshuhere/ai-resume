import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import Analysis from "../models/Analysis.js";
import { parseResume } from "../utils/fileParser.js";
import { analyzeResume, matchJobDescription } from "../utils/geminiService.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF and DOCX files are allowed"));
        }
    },
});

router.post("/analyze", auth, upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required",
            });
        }

        const resumeText = await parseResume(req.file);

        const analysis = await analyzeResume(resumeText);

        const newAnalysis = new Analysis({
            userId: req.userId,
            resumeText,
            fileName: req.file.originalname,
            atsScore: analysis.atsScore,
            skills: analysis.skills,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            suggestions: analysis.suggestions,
        });

        await newAnalysis.save();

        res.json({
            success: true,
            message: "Resume analyzed successfully",
            data: {
                id: newAnalysis._id,
                fileName: newAnalysis.fileName,
                atsScore: newAnalysis.atsScore,
                skills: newAnalysis.skills,
                strengths: newAnalysis.strengths,
                weaknesses: newAnalysis.weaknesses,
                suggestions: newAnalysis.suggestions,
                createdAt: newAnalysis.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.post("/match-job/:analysisId", auth, async (req, res) => {
    try {
        const { analysisId } = req.params;
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Job description is required",
            });
        }

        const analysis = await Analysis.findOne({
            _id: analysisId,
            userId: req.userId,
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found",
            });
        }

        const matchResult = await matchJobDescription(
            analysis.resumeText,
            jobDescription
        );

        analysis.jobDescription = jobDescription;
        analysis.matchScore = matchResult.matchScore;
        analysis.missingSkills = matchResult.missingSkills;
        await analysis.save();

        res.json({
            success: true,
            message: "Job matching completed",
            data: {
                matchScore: matchResult.matchScore,
                missingSkills: matchResult.missingSkills,
                matchedSkills: matchResult.matchedSkills,
                recommendations: matchResult.recommendations,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get("/my-analyses", auth, async (req, res) => {
    try {
        const analyses = await Analysis.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .select("-resumeText");

        res.json({
            success: true,
            count: analyses.length,
            data: analyses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get("/analysis/:id", auth, async (req, res) => {
    try {
        const analysis = await Analysis.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found",
            });
        }

        res.json({
            success: true,
            data: analysis,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.delete("/analysis/:id", auth, async (req, res) => {
    try {
        const analysis = await Analysis.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found",
            });
        }

        res.json({
            success: true,
            message: "Analysis deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;
