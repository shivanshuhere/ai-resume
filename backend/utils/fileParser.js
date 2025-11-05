import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

export const parseResume = async (file) => {
    try {
        const fileExtension = file.originalname.split(".").pop().toLowerCase();
        let text = "";

        if (fileExtension === "pdf") {
            const pdfParse = (await import("pdf-parse")).default;
            const pdfDoc = await PDFDocument.load(file.buffer);
            const pdfBytes = await pdfDoc.save();
            const data = await pdfParse(Buffer.from(pdfBytes));
            text = data.text;
        } else if (fileExtension === "docx" || fileExtension === "doc") {
            const result = await mammoth.extractRawText({
                buffer: file.buffer,
            });
            text = result.value;
        } else {
            throw new Error(
                "Unsupported file format. Please upload PDF or DOCX"
            );
        }

        if (!text) {
            throw new Error("Could not extract text from the document");
        }
        text = text.replace(/\s+/g, " ").trim();
        return text;
    } catch (error) {
        throw new Error(`File parsing error: ${error.message}`);
    }
};
