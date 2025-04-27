import ev from 'env-var';

export const currencyRates = {
  USD: ev.get('USD_RATE').default('518.28').asFloat(),
  EUR: ev.get('EUR_RATE').default('588.15').asFloat(),
  RUB: ev.get('RUB_RATE').default('6.2').asFloat(),
}
