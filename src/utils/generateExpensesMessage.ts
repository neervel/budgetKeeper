import dayjs from 'dayjs';
import { replaceThousands } from './replaceThousands';

export const generateExpensesMessage = (purchases: any[], checkCorrect = true) => {
  let message = checkCorrect ?  '' : 'Покупки добавлены:\n'

  purchases.forEach((purchase) => {
    message += `\n${dayjs(purchase.date).format('DD.MM')}: ${purchase.comment} (${purchase.category}), ${replaceThousands(purchase.amount)}₸`
  });

  return message;
};
