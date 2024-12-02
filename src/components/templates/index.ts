import DefaultTemplate from "./DefaultTemplate";

export const templates = {
  default: DefaultTemplate,
} as const;

export type TemplateName = keyof typeof templates;

export const getTemplate = (templateName: string) => {
  return templates[templateName as TemplateName] || templates.default;
};