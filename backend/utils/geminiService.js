import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const analyzeResume = async (resumeText) => {
    try {
        const prompt = `
You are an expert ATS (Applicant Tracking System) and resume reviewer. Analyze the following resume and provide a detailed evaluation.

Resume:
${resumeText}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):
{
  "atsScore": <number between 0-100>,
  "skills": ["skill1", "skill2", ...],
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...]
}

Guidelines:
- atsScore: Rate how well this resume would pass an ATS (consider keywords, formatting, sections)
- skills: Extract all technical and soft skills mentioned
- strengths: 3-5 key strengths of this resume
- weaknesses: 3-5 areas that need improvement
- suggestions: 5-7 specific, actionable suggestions to improve the resume
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid response format from AI");
        }

        const analysis = JSON.parse(jsonMatch[0]);

        if (
            !analysis.atsScore ||
            !analysis.skills ||
            !analysis.strengths ||
            !analysis.weaknesses ||
            !analysis.suggestions
        ) {
            throw new Error("Incomplete analysis from AI");
        }

        return analysis;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(`AI analysis failed: ${error.message}`);
    }
};

export const matchJobDescription = async (resumeText, jobDescription) => {
    try {
        const prompt = `
You are an expert job matching system. Compare the following resume with the job description and provide a detailed match analysis.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):
{
  "matchScore": <number between 0-100>,
  "missingSkills": ["skill1", "skill2", ...],
  "matchedSkills": ["skill1", "skill2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}

Guidelines:
- matchScore: Overall compatibility percentage
- missingSkills: Skills required in JD but missing from resume
- matchedSkills: Skills that match between resume and JD
- recommendations: Specific advice to improve match score
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid response format from AI");
        }

        const matchAnalysis = JSON.parse(jsonMatch[0]);

        return matchAnalysis;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(`Job matching failed: ${error.message}`);
    }
};
