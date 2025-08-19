import { create } from "zustand";
import { EmailService, EmailTemplateData, EmailPreviewResponse, TemplatesResponse } from "../../service/Teacher/email.service";

interface EmailState {
  // State
  templates: string[];
  selectedTemplate: string;
  previewHtml: string;
  templateData: EmailTemplateData;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTemplates: () => Promise<void>;
  setSelectedTemplate: (template: string) => void;
  setTemplateData: (data: EmailTemplateData) => void;
  updateTemplateData: (key: string, value: any) => void;
  previewTemplate: () => Promise<void>;
  sendEmail: () => Promise<void>;
  clearError: () => void;
  resetState: () => void;
}

export const useEmailStore = create<EmailState>((set, get) => ({
  // Initial state
  templates: [],
  selectedTemplate: "",
  previewHtml: "",
  templateData: {},
  loading: false,
  error: null,

  // Actions
  fetchTemplates: async () => {
    try {
      set({ loading: true, error: null });
      const response: TemplatesResponse = await EmailService.getTemplates();
      set({ 
        templates: response.templates,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: "ไม่สามารถดึงรายการ templates ได้",
        loading: false 
      });
    }
  },

  setSelectedTemplate: (template: string) => {
    set({ selectedTemplate: template });
  },

  setTemplateData: (data: EmailTemplateData) => {
    set({ templateData: data });
  },

  updateTemplateData: (key: string, value: any) => {
    set((state) => ({
      templateData: {
        ...state.templateData,
        [key]: value
      }
    }));
  },

  previewTemplate: async () => {
    const { selectedTemplate, templateData } = get();
    
    if (!selectedTemplate) {
      set({ error: "กรุณาเลือก template" });
      return;
    }

    try {
      set({ loading: true, error: null });
      const response: EmailPreviewResponse = await EmailService.previewTemplate(
        selectedTemplate,
        templateData
      );
      set({ 
        previewHtml: response.html,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: "ไม่สามารถ preview template ได้",
        loading: false 
      });
    }
  },

  sendEmail: async () => {
    const { selectedTemplate, templateData } = get();
    
    if (!selectedTemplate) {
      set({ error: "กรุณาเลือก template" });
      return;
    }

    if (!templateData.recipientEmail) {
      set({ error: "กรุณากรอกอีเมลผู้รับ" });
      return;
    }

    try {
      set({ loading: true, error: null });
      const response = await EmailService.sendEmail(
        selectedTemplate,
        templateData
      );
      set({ loading: false });
      alert("ส่งอีเมลสำเร็จ!");
    } catch (error) {
      set({ 
        error: "ไม่สามารถส่งอีเมลได้",
        loading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set({
      templates: [],
      selectedTemplate: "",
      previewHtml: "",
      templateData: {},
      loading: false,
      error: null
    });
  }
}));
