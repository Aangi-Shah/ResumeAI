const Resume = require('../models/Resume');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const analyzeWithAI = async (
  text,
  type = 'analyze',
  jobDescription = ''
) => {

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash'
  });

  let prompt = '';

  if (type === 'analyze') {

    prompt = `
You are an ATS Resume Analyzer AI.

Compare the resume against the provided job description.

Return ONLY valid JSON in this exact format:

{
  "score": number,
  "strengths": [string],
  "weaknesses": [string],
  "improvedBullets": [
    {
      "original": string,
      "improved": string
    }
  ],
  "missingKeywords": [string],
  "summary": string
}

Resume Text:
${text}

Job Description:
${jobDescription}

Instructions:
- Score resume based on ATS relevance to job description
- Find missing ATS keywords
- Suggest stronger bullet points
- Mention strengths and weaknesses
- Give concise summary
`;

  } else {

    prompt = `
Generate a professional cover letter based on this resume and job description.

Resume:
${text}

Job Description:
${jobDescription}

Return ONLY the cover letter text.
`;
  }

  try {

    const result = await model.generateContent(
      prompt
    );

    const response = result.response.text();

    if (type === 'analyze') {

      const cleaned = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleaned);
    }

    return response;

  } catch (error) {

    console.error(
      'Gemini AI Error:',
      error
    );

    throw new Error('AI Analysis failed');
  }
};

exports.analyzeResume = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    const dataBuffer = req.file.buffer;

    const pdfData = await pdf(
      dataBuffer
    );

    const text = pdfData.text;

    const analysis = await analyzeWithAI(
      text,
      'analyze',
      req.body.jobDescription
    );

    const resume = new Resume({
      userId: req.userData.userId,
      fileName: req.file.originalname,
      extractedText: text,
      aiAnalysis: analysis
    });

    await resume.save();

    res.json(resume);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

exports.generateCoverLetter = async (
  req,
  res
) => {

  try {

    const {
      jobDescription,
      resumeId
    } = req.body;

    let text = '';

    if (resumeId) {

      const resume =
        await Resume.findOne({
          _id: resumeId,
          userId: req.userData.userId
        });

      text = resume.extractedText;

    } else if (req.file) {

      const pdfData = await pdf(
        req.file.buffer
      );

      text = pdfData.text;

    } else {

      return res.status(400).json({
        message: 'Resume required'
      });
    }

    const coverLetter =
      await analyzeWithAI(
        text,
        'cover-letter',
        jobDescription
      );

    res.json({
      coverLetter
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};