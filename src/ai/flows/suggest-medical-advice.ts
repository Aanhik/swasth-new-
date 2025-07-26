'use server';

/**
 * @fileOverview An AI flow that suggests possible medical advice based on user-provided symptoms.
 *
 * - suggestMedicalAdvice - A function that takes symptoms as input and returns possible medical advice.
 * - SuggestMedicalAdviceInput - The input type for the suggestMedicalAdvice function.
 * - SuggestMedicalAdviceOutput - The return type for the suggestMedicalAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMedicalAdviceInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms experienced by the user.'),
});
export type SuggestMedicalAdviceInput = z.infer<typeof SuggestMedicalAdviceInputSchema>;

const SuggestMedicalAdviceOutputSchema = z.object({
  advice: z
    .string()
    .describe('Possible medical advice based on the provided symptoms.'),
  disclaimer: z
    .string()
    .describe(
      'A disclaimer informing the user that the advice is not a substitute for professional medical consultation.'
    ),
});
export type SuggestMedicalAdviceOutput = z.infer<typeof SuggestMedicalAdviceOutputSchema>;

export async function suggestMedicalAdvice(
  input: SuggestMedicalAdviceInput
): Promise<SuggestMedicalAdviceOutput> {
  return suggestMedicalAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMedicalAdvicePrompt',
  input: {schema: SuggestMedicalAdviceInputSchema},
  output: {schema: SuggestMedicalAdviceOutputSchema},
  prompt: `You are a healthcare assistant. Suggest possible conditions for the following symptoms:

Symptoms: {{{symptoms}}}

Do not give a diagnosis or prescribe medication. Include the following disclaimer in your response:

"This information is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any questions you may have regarding your health."`,
});

const suggestMedicalAdviceFlow = ai.defineFlow(
  {
    name: 'suggestMedicalAdviceFlow',
    inputSchema: SuggestMedicalAdviceInputSchema,
    outputSchema: SuggestMedicalAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
