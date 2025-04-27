import { currencyRates } from '../config/currencyRates';

export const convertToKZT = (expenses: { amount: number, currency: string }[]) => {
  return expenses.map((expense: any) => {
    let convertedAmount = expense.amount;

    if (expense.currency !== 'KZT') {
      convertedAmount = Math.round(convertedAmount * currencyRates[expense.currency as keyof typeof currencyRates] / 10) * 10
    }

    delete expense.currency;

    return {
      ...expense,
      amount: convertedAmount,
    };
  })
}
