import { Client } from '@notionhq/client';
import { notionConfig } from '../config/notion.config';
import dayjs from 'dayjs';
import { log } from '../utils/logger';

export const notionClient = new Client({
  auth: notionConfig.token,
});

await notionClient.search({ page_size: 1 })
  .then((res) => {
    if (res) {
      log.info('Notion client created!');
    } else {
      log.warn('Notion client not created :(');
    }
  })
  .catch((err) => {
    log.error(err, 'Error while starting notion client:');
  });

const writePurchase = async (purchase: any): Promise<void> => {
  log.info(purchase, 'Creating purchase');

  await notionClient.pages.create({
    parent: {
      database_id: notionConfig.databaseId,
    },
    properties: {
      'Описание': {
        title: [{
          text: {
            content: purchase.comment,
          },
        }],
      },
      'Категория': {
        select: {
          name: purchase.category,
        },
      },
      'Стоимость': {
        number: purchase.amount,
      },
      'Дата': {
        date: {
          start: dayjs(purchase.date).format('YYYY-MM-DD'),
        },
      },
    },
  });

  log.info(purchase, 'Purchase wrote');
};

export const writePurchasesToDb = async (purchases: any[]) => {
  await Promise.all(
    purchases.map(async (purchase) => await writePurchase(purchase)),
  );
}
