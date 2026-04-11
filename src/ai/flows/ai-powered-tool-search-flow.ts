'use server';
/**
 * @fileOverview This file implements a Genkit flow for an AI-powered tool search functionality.
 * It takes a natural language query from the user and suggests relevant tools or tool categories.
 *
 * - aiPoweredToolSearch - A function that handles the AI tool recommendation process.
 * - AiPoweredToolSearchInput - The input type for the aiPoweredToolSearch function.
 * - AiPoweredToolSearchOutput - The return type for the aiPoweredToolSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiPoweredToolSearchInputSchema = z.object({
  query: z.string().describe('The natural language query from the user (e.g., "I need to make an image smaller", "convert a PDF to a document").'),
});
export type AiPoweredToolSearchInput = z.infer<typeof AiPoweredToolSearchInputSchema>;

const SuggestedToolOrCategorySchema = z.object({
  name: z.string().describe('The name of the suggested tool or category (e.g., "Image Compressor", "PDF Tools").'),
  type: z.enum(['tool', 'category']).describe('Whether the suggestion is a specific tool or a category of tools.'),
  description: z.string().describe('A brief description of the suggested tool or category, explaining its purpose and why it\'s relevant.'),
  link: z.string().describe('The internal relative path to navigate to this tool or category (e.g., "/tools/image-compressor" or "/categories/pdf-tools").'),
});

const AiPoweredToolSearchOutputSchema = z.object({
  suggestions: z.array(SuggestedToolOrCategorySchema).describe('A list of up to 3 suggested tools or tool categories relevant to the user\'s query, ordered by relevance.').max(3),
});
export type AiPoweredToolSearchOutput = z.infer<typeof AiPoweredToolSearchOutputSchema>;

export async function aiPoweredToolSearch(input: AiPoweredToolSearchInput): Promise<AiPoweredToolSearchOutput> {
  return aiPoweredToolSearchFlow(input);
}

const aiPoweredToolSearchPrompt = ai.definePrompt({
  name: 'aiPoweredToolSearchPrompt',
  input: { schema: AiPoweredToolSearchInputSchema },
  output: { schema: AiPoweredToolSearchOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  },
  prompt: `You are an AI assistant designed to help users find the right online tools.

Here is a list of available tool categories and specific popular tools that you can recommend:

---
Available Tool Categories:
- **PDF Tools**: Description: Tools for merging, splitting, and compressing PDF files. Link: /categories/pdf-tools
- **Image Tools**: Description: Tools for resizing, compressing, and converting image formats. Link: /categories/image-tools
- **Text Tools**: Description: Tools for word counting, case conversion, and general text manipulation. Link: /categories/text-tools
- **Calculators**: Description: Various calculators for age, EMI, and percentage calculations. Link: /categories/calculators
- **Developer Tools**: Description: Utilities for JSON formatting, Base64 encoding/decoding, and Regex testing. Link: /categories/developer-tools

Available Popular Tools:
- **Image Compressor**: Description: Reduce the file size of images while maintaining quality. Link: /tools/image-compressor
- **PDF to Word Converter**: Description: Convert PDF documents into editable Microsoft Word files. Link: /tools/pdf-to-word-converter
- **Word Counter**: Description: Count words, characters, and sentences in any given text. Link: /tools/word-counter
- **Remove Background Tool**: Description: Automatically remove the background from any image. Link: /tools/remove-background
- **QR Code Generator**: Description: Create scannable QR codes from text or URLs. Link: /tools/qr-code-generator
---

Based on the user's query, identify their intent and suggest up to 3 of the MOST RELEVANT tools or tool categories from the list above. Provide a clear description and the corresponding internal link for each suggestion.

If multiple suggestions are equally relevant, prioritize specific tools over general categories. If you cannot find any relevant tools, return an empty list of suggestions.

User Query: {{{query}}}`,
});

const aiPoweredToolSearchFlow = ai.defineFlow(
  {
    name: 'aiPoweredToolSearchFlow',
    inputSchema: AiPoweredToolSearchInputSchema,
    outputSchema: AiPoweredToolSearchOutputSchema,
  },
  async (input) => {
    const { output } = await aiPoweredToolSearchPrompt(input);
    return output!;
  }
);
