import ev from 'env-var';

export const telegramConfig = {
  token: ev.get('TELEGRAM_TOKEN').required().asString(),
}
