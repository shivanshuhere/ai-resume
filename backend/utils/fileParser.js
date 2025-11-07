import { PDFParse as pdf } from "pdf-parse";
import mammoth from "mammoth";

export const parseResume = async (file) => {
    try {
        const fileExtension = file.originalname.split(".").pop().toLowerCase();
        let text = "";

        if (fileExtension === "pdf") {
            if (!file.buffer) throw new Error("Uploaded PDF has no data");
            const parser = new pdf({ data: file.buffer });
            const data = await parser.getText();
            text = data.text.replace(/\s+/g, " ").trim();
            console.log("text", text);
        } else if (fileExtension === "docx") {
            const result = await mammoth.extractRawText({
                buffer: file.buffer,
            });
            text = result && result.value ? result.value : "";
        } else {
            throw new Error(
                "Unsupported file format. Please upload PDF or DOCX"
            );
        }
        if (!text || text.length < 50) {
            throw new Error(
                "Resume content is too short or could not be extracted"
            );
        }

        return text;
    } catch (error) {
        throw new Error(`File parsing error: ${error.message}`);
    }
};
