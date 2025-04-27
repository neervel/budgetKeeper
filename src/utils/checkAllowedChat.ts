import { telegramConfig } from '../config/telegram.config';

const allowedChats = new Set(telegramConfig.allowedChats.map((chatId) => +chatId));

export const checkAllowedChat = (chatId: number): boolean => {
  return allowedChats.has(chatId);
};
