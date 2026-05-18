import axios from 'axios';
import { env } from '../config/env';

/**
 * Calls Hugging Face inference API to summarize text
 */
export const summarizeText = async (text) => {
  if (!env.HF_TOKEN) {
    throw new Error("Hugging Face token is missing.");
  }
  
  if (!text || text.length < 50) {
    return text || "No sufficient text to summarize.";
  }

  try {
    const response = await axios.post(
      `${env.HF_API_URL}${env.HF_MODEL}`,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // HF inference returns an array of results, our model typically returns an object with `summary_text`
    if (response.data && response.data.length > 0) {
      return response.data[0].summary_text || response.data[0].generated_text || "Summarization failed.";
    }
    return "Could not generate summary.";
  } catch (error) {
    console.error("Error calling Hugging Face API", error);
    // Add handling for free tier Model Loading
    if (error.response && error.response.status === 503) {
       throw new Error("Model is currently loading on Hugging Face free tier. Please try again in 15 seconds.");
    }
    throw new Error("Failed to summarize text.");
  }
};
