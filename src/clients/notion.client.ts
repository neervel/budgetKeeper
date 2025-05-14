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
};

export const getPurchasesByDate = async (date = dayjs()): Promise<any> => {
  const purchases = await notionClient.databases.query({
    database_id: notionConfig.databaseId,
    filter: {
      property: 'Дата',
      date: {
        equals: date.format('YYYY-MM-DD'),
      },
    },
    sorts: [{
      property: 'Категория',
      direction: 'ascending',
    }],
  })
    .then((response) => response.results.map((result: any) => ({
      amount: result.properties['Стоимость'].number,
      category: result.properties['Категория'].select.name,
      name: result.properties['Описание'].title[0].text.content,
    })));

  const count = purchases.length;
  let totalAmount = 0;
  const categories: any = {};

  purchases.forEach((purchase) => {
    const { amount, category } = purchase;

    totalAmount += amount;

    if (!categories[category]) {
      categories[category] = {
        amount: 0,
        purchases: [],
      };
    }

    categories[category].amount += amount;
    categories[category].purchases.push(purchase);
  });

  return { count, totalAmount, categories };
}
