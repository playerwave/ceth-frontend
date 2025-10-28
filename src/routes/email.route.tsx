import EmailTemplatePreview from "@/pages/Test/email_template_preview";

export const emailRoutes = [
  {
    path: "/email-template-preview",
    element: <EmailTemplatePreview />,
    roles: ["Teacher", "Admin"]
  }
];
