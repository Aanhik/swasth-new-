import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-medical-advice.ts';
import '@/ai/flows/analyze-symptoms.ts';
import '@/ai/flows/extract-prescription-text.ts';
