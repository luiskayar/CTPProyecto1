import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Falta la variable de entorno OPENAI_API_KEY');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});