import express from "express";
import { getLinkPreview } from "link-preview-js";
import { getGeminiResponse } from "./utils/data_ai_service.js";
import { appendDataToFile } from "./utils/handleFile.js";
import fs from "fs";
import cors from 'cors';

const app = express();
const PORT = 3000;
const dataFilePath = "./data.json";

app.use(express.json());
app.use(cors())

app.post("/link-preview", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required in the request body" });
  }

  try {
    const data = await getLinkPreview(url, {
      headers: {
        "User-Agent": "WhatsApp/2.22.20.72 A"
      }
    });

    let prompt = `${JSON.stringify(data)} consider the data above given and smartly select only one elements for each field, and if there is a good and generic description dont short or summarize it and title already dont change it if not title make it considering the domain of url and generate or extract if there is hashtags in the data upto 15 good one word relevant tags for search this object and only return a json object not extra characters in this format { "title": "", "description": "", "domain": "", "img": "", "favicon": "", "tags":[] }`;
    const geminiResponse = await getGeminiResponse(prompt);
    console.log(geminiResponse);

    if (geminiResponse) {
      const cleanedText = geminiResponse.replace(/```json|```/g, "").trim();
      let formattedData = JSON.parse(cleanedText);
      formattedData = {...formattedData,url};
      appendDataToFile(formattedData);
      res.status(200).json(formattedData);
    } else {
      res.status(500).json({ error: "Failed to get response from Gemini" });
    }
  } catch (error) {
    console.error("Error fetching link preview:", error);
    res.status(500).json({ error: "Failed to fetch link preview" });
  }
});

app.get("/data", (req, res) => {
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data.json:", err);
      res.status(500).json({ error: "Failed to read data" });
    } else {
      try {
        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData);
      } catch (parseError) {
        console.error("Error parsing JSON data:", parseError);
        res.status(500).json({ error: "Failed to parse data" });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
