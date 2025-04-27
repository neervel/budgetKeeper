import { Telegraf } from 'telegraf';
import { telegramConfig } from '../config/telegram.config';
import { message } from 'telegraf/filters';
import { log } from '../utils/logger';
import { getPurchase } from './openAi.client';
import { generateExpensesMessage } from '../utils/generateExpensesMessage';
import { writePurchasesToDb } from './notion.client';
import { parseAudioMessage } from '../utils/parseAudioMessage';

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
