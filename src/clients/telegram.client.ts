import { Telegraf } from 'telegraf';
import { telegramConfig } from '../config/telegram.config';
import { message } from 'telegraf/filters';
import { log } from '../utils/logger';
import { getPurchase } from './openAi.client';
import { generateExpensesMessage } from '../utils/generateExpensesMessage';
import { writePurchasesToDb } from './notion.client';
import { parseAudioMessage } from '../utils/parseAudioMessage';
import { checkAllowedChat } from '../utils/checkAllowedChat';
import { callback } from 'telegraf/typings/button';
import { usersStates } from '../tools/usersStates';
import { channel } from 'node:diagnostics_channel';

export const bot = new Telegraf(telegramConfig.token);

const replyExtra = {
  reply_markup: {
    inline_keyboard: [[
      { callback_data: 'add_purchase', text: 'Все верно ✅' },
      { callback_data: 'edit_purchase', text: 'Изменить ✏️' },
    ]],
  },
}

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

  usersStates.setCurrentPurchases(id, purchases);
  await ctx.reply(generateExpensesMessage(purchases), replyExtra);
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

  usersStates.setCurrentPurchases(id, purchases);
  await ctx.reply(generateExpensesMessage(purchases), replyExtra);
});

bot.action('add_purchase', async (ctx) => {
  const { id } = ctx.update.callback_query.from;
  const currentPurchases = usersStates.getCurrentPurchases(id);

  await writePurchasesToDb(currentPurchases);

  await ctx.editMessageText(generateExpensesMessage(currentPurchases, false));
});

bot.action('edit_purchase', async (ctx) => {
  await ctx.editMessageText('Пришли покупку еще раз');
});
