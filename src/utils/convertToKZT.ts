import { currencyRates } from '../config/currencyRates';
import { log } from './logger';

export const convertToKZT = (expenses: { amount: number, currency: string }[]) => {
  log.info(expenses, 'Expenses for convert');

  return expenses.map((expense: any) => {
    let convertedAmount = expense.amount;

    if (expense.currency !== 'KZT') {
      const currencyRate = currencyRates[expense.currency as keyof typeof currencyRates] || 1;
      convertedAmount = Math.round(convertedAmount * currencyRate / 10) * 10
    }

    delete expense.currency;

    return {
      ...expense,
      amount: convertedAmount,
    };
  })
}
