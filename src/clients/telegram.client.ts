import { Telegraf } from 'telegraf';
import { telegramConfig } from '../config/telegram.config';
import { message } from 'telegraf/filters';
import { log } from '../utils/logger';
import { getPurchase } from './openAi.client';
import { generateExpensesMessage } from '../utils/generateExpensesMessage';
import { writePurchasesToDb } from './notion.client';
import { parseAudioMessage } from '../utils/parseAudioMessage';
import { checkAllowedChat } from '../utils/checkAllowedChat';

export const bot = new Telegraf(telegramConfig.token);

bot.command('start', async (ctx) => {
  log.info(ctx.message.from, 'Received command');
  const { id } = ctx.message.from;

  if (!checkAllowedChat(id)) {
    log.warn(`Not authorized user ${id}`);
    await ctx.reply('Извините, вы не авторизованы');

    return;
  }

  await ctx.reply('Привет 👋\nЧтобы добавить покупку пришли мне голосовое или текст');
});

bot.on(message('voice'), async (ctx) => {
  log.info(ctx.message.from, 'Received audio');
  const { id } = ctx.message.from;

  if (!checkAllowedChat(id)) {
    log.warn(`Not authorized user ${id}`);
    await ctx.reply('Извините, вы не авторизованы');

    return;
  }

  const text = await parseAudioMessage(ctx);
  const purchases = await getPurchase(text);

  if (!purchases.length) {
    await ctx.reply('Покупки не распознаны :(');

    return;
  }

  await writePurchasesToDb(purchases);

  await ctx.reply(generateExpensesMessage(purchases));
});

bot.on(message('text'), async (ctx) => {
  log.info(ctx.message.from, 'Received message');
  const { id } = ctx.message.from;

  if (!checkAllowedChat(id)) {
    log.warn(`Not authorized user ${id}`);
    await ctx.reply('Извините, вы не авторизованы');

    return;
  }

  const text = ctx.message.text
  const purchases = await getPurchase(text);

  if (!purchases.length) {
    await ctx.reply('Покупки не распознаны :(');

    return;
  }

  await writePurchasesToDb(purchases);

  await ctx.reply(generateExpensesMessage(purchases));
});
