import { openAIConfig } from '../config/openAI.config';

export const purchaseTool = [
  {
    name: "log_expenses",
    description: "Разбить текст на список трат",
    parameters: {
      type: "object",
      properties: {
        expenses: {
          type: "array",
          items: {
            type: "object",
            properties: {
              amount: {
                type: "number",
                description: "Сумма в оригинальной валюте (например, 20)"
              },
              currency: {
                type: "string",
                enum: ["KZT", "USD", "EUR", "RUB"],
                description: "Код валюты, в которой была трата, по дефолту - KZT"
              },
              category: {
                type: "string",
                enum: openAIConfig.purchaseCategories,
                description: "Категория покупки"
              },
              comment: {
                type: "string",
                description: "Краткое описание покупки с большой буквы (без слов 'купил', 'заплатил' и т.д.). Например: 'Кофта и шорты', 'Бургер и кола', 'Оплата Netflix'"
              },
              date: {
                type: "string",
                format: "date",
                description: "Дата покупки в формате YYYY-MM-DD",
              }
            },
            required: ["amount", "comment", "category", "date"]
          }
        }
      },
      required: ["expenses"]
    }
  }
]
