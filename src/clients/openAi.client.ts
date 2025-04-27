import OpenAI from 'openai';
import { openAIConfig } from '../config/openAI.config';
import { purchaseTool } from '../tools/purchase';
import dayjs from 'dayjs';
import { convertToKZT } from '../utils/convertToKZT';
import * as fs from 'node:fs';
import { log } from '../utils/logger';

const openai = new OpenAI({
  apiKey: openAIConfig.token,
});

export const getPurchase = async (input: string) => {
  const today = dayjs().format('YYYY-MM-DD');

  const response = await openai.chat.completions.create({
    model: "o4-mini-2025-04-16",
    messages: [
      {
        role: "system",
        content: openAIConfig.systemPrompt + `Сегодняшняя дата: ${today}. Используй это как контекст для дат.`
      },
      {
        role: "user",
        content: input,
      }
    ],
    tools: [
      {
        type: "function",
        function: purchaseTool[0],
      }
    ],
    tool_choice: { type: "function", function: { name: "log_expenses" } }
  });

  // @ts-ignore
  const expenses = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).expenses;

  const convertedExpenses = convertToKZT(expenses);

  log.info(convertedExpenses, 'Purchases parsed');

  return convertedExpenses;
}

export const convertAudioToText = async (voicePath: string): Promise<string> => {
  const { text } = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: fs.createReadStream(voicePath),
    language: "ru"
  });

  log.info(`Transcript text: ${text}`)

  return text;
}
