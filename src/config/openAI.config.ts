import ev from 'env-var';

export const openAIConfig = {
  token: ev.get('OPENAI_API_KEY').required().asString(),
  systemPrompt: ev.get('OPENAI_SYSTEM_PROMPT').default(`
    Ты помощник по бюджету. 
    Разбивай входной текст на отдельные траты и присваивай каждой трате одну из категорий.
    Категория должна быть строго из этого списка.
  `).asString(),
  purchaseCategories: ev.get('PURCHASE_CATEGORIES').asArray(),
};
