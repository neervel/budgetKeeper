import ev from 'env-var';

export const telegramConfig = {
  token: ev.get('TELEGRAM_TOKEN').required().asString(),
  allowedChats: ev.get('ALLOWED_CHAT_IDS').default('469075562,511939312').asArray(),
}
