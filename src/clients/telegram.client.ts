import { Telegraf } from 'telegraf';
import { telegramConfig } from '../config/telegram.config';
import { message } from 'telegraf/filters';
import path from 'node:path';
import axios from 'axios';
import * as fs from 'node:fs';
import { log } from '../utils/logger';
import { convertAudioToText, getPurchase } from './openAi.client';
import { generateExpensesMessage } from '../utils/generateExpensesMessage';
import { writePurchasesToDb } from './notion.client';

export const bot = new Telegraf(telegramConfig.token);

bot.on(message('voice'), async (ctx) => {
  log.info(ctx.message.from, 'Received audio');

  const text = await parseAudioMessage(ctx);
  const purchases = await getPurchase(text);

  await writePurchasesToDb(purchases);

  await ctx.reply(generateExpensesMessage(purchases));
});

bot.on(message('text'), async (ctx) => {
  log.info(ctx.message.from, 'Received message');

  const text = ctx.message.text
  const purchases = await getPurchase(text);

  await writePurchasesToDb(purchases);

  await ctx.reply(generateExpensesMessage(purchases));
});

const saveAudio = async (fileLink: URL, fileId: string): Promise<string> => {
  const pathToSave = `audio/${fileId}.ogg`;

  const voicePath = path.resolve(pathToSave);
  const response = await axios.get(fileLink.href, { responseType: "stream" })
  response.data.pipe(fs.createWriteStream(voicePath))

  await new Promise((resolve) => response.data.on("end", resolve));

  log.info(`Audio saved to ${pathToSave}`);

  return pathToSave;
};

const parseAudioMessage = async (ctx: any): Promise<string> => {
  const fileId = ctx.message.voice.file_id
  const fileLink = await ctx.telegram.getFileLink(fileId)

  const audioPath = await saveAudio(fileLink, fileId);

  const text = await convertAudioToText(audioPath);

  fs.rm(audioPath, () => log.info(`Audio ${audioPath} deleted`));

  return text;
}
