import ev from 'env-var';

export const notionConfig = {
  token: ev.get('NOTION_TOKEN').required().asString(),
  databaseId: ev.get('NOTION_DATABASE_ID').required().asString(),
}
