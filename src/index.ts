import { purchaseTool } from './tools/purchase';
import { getPurchase } from './clients/openAi.client';
import { bot } from './clients/telegram.client';
import { notionClient } from './clients/notion.client';

bot.launch();

