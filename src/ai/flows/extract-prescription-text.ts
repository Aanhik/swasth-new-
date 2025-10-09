'use server';

/**
 * @fileOverview An AI flow that extracts text from a prescription image.
 *
 * - extractPrescriptionText - A function that takes an image data URI and returns the extracted text.
 * - ExtractPrescriptionTextInput - The input type for the extractPrescriptionText function.
 * - ExtractPrescriptionTextOutput - The return type for the extractPrescriptionText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractPrescriptionTextInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a medical prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractPrescriptionTextInput = z.infer<typeof ExtractPrescriptionTextInputSchema>;

const ExtractPrescriptionTextOutputSchema = z.object({
  extractedText: z
    .string()
    .describe('The extracted text from the prescription.'),
});
export type ExtractPrescriptionTextOutput = z.infer<typeof ExtractPrescriptionTextOutputSchema>;

export async function extractPrescriptionText(
  input: ExtractPrescriptionTextInput
): Promise<ExtractPrescriptionTextOutput> {
  return extractPrescriptionTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractPrescriptionTextPrompt',
  input: { schema: ExtractPrescriptionTextInputSchema },
  output: { schema: ExtractPrescriptionTextOutputSchema },
  prompt: `You are an OCR tool specialized in reading medical prescriptions. Extract all the text you can from the following image.

Photo: {{media url=imageDataUri}}`,
});

const extractPrescriptionTextFlow = ai.defineFlow(
  {
    name: 'extractPrescriptionTextFlow',
    inputSchema: ExtractPrescriptionTextInputSchema,
    outputSchema: ExtractPrescriptionTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
