import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation keys - comprehensive set for the admin dashboard
const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    services: "Services",
    aboutUs: "About Us",
    whyChooseUs: "Why Choose Us",
    ourClients: "Our Clients",
    categories: "Categories",
    ourProjects: "Our Projects",
    news: "News",
    testimonials: "Testimonials",
    contactMessages: "Contact Messages",
    contactInfo: "Contact & Location",

    // Common Actions
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    create: "Create",
    update: "Update",
    view: "View",
    search: "Search",
    filter: "Filter",
    addCategory: "Add Category",
    editCategory: "Edit Category",
    deleteCategory: "Delete Category",
    searchCategories: "Search categories...",
    addTestimonial: "Add Testimonial",
    editTestimonial: "Edit Testimonial",
    deleteTestimonial: "Delete Testimonial",
    searchTestimonials: "Search testimonials...",
    rating: "Rating",
    text: "Text",
    typeUnit: "Type Unit",
    location: "Location",
    searchMessages: "Search messages...",
    deleteMessage: "Delete Message",
    addNews: "Add News",
    editNews: "Edit News",
    deleteNews: "Delete News",
    searchNews: "Search news...",
    content: "Content",
    actions: "Actions",
    createdAt: "Created At",

    // Form Fields
    title: "Title",
    description: "Description",
    shortDescription: "Short Description",
    longDescription: "Long Description",
    image: "Image",
    upload: "Upload",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",

    // Dashboard
    totalServices: "Total Services",
    totalTestimonials: "Total Testimonials",
    unreadMessages: "Unread Messages",
    totalProjects: "Total Projects",

    // Settings
    language: "Language",
    theme: "Theme",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    profile: "Profile",
    logout: "Logout",

    // Messages
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",

    // Validation
    required: "This field is required",
    invalidEmail: "Please enter a valid email",
    invalidPhone: "Please enter a valid phone number",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    services: "الخدمات",
    aboutUs: "من نحن",
    whyChooseUs: "لماذا تختارنا",
    ourClients: "عملاؤنا",
    categories: "الفئات",
    ourProjects: "مشاريعنا",
    news: "الأخبار",
    testimonials: "شهادات العملاء",
    contactMessages: "رسائل التواصل",
    contactInfo: "معلومات التواصل والموقع",

    // Common Actions
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    create: "إنشاء",
    update: "تحديث",
    view: "عرض",
    search: "بحث",
    filter: "تصفية",
    addCategory: "إضافة فئة",
    editCategory: "تعديل الفئة",
    deleteCategory: "حذف الفئة",
    searchCategories: "البحث في الفئات...",
    addTestimonial: "إضافة شهادة",
    editTestimonial: "تعديل الشهادة",
    deleteTestimonial: "حذف الشهادة",
    searchTestimonials: "البحث في الشهادات...",
    rating: "التقييم",
    text: "النص",
    typeUnit: "نوع الوحدة",
    location: "الموقع",
    searchMessages: "البحث في الرسائل...",
    deleteMessage: "حذف الرسالة",
    addNews: "إضافة خبر",
    editNews: "تعديل الخبر",
    deleteNews: "حذف الخبر",
    searchNews: "البحث في الأخبار...",
    content: "المحتوى",
    actions: "الإجراءات",
    createdAt: "تاريخ الإنشاء",

    // Form Fields
    title: "العنوان",
    description: "الوصف",
    shortDescription: "وصف مختصر",
    longDescription: "وصف مفصل",
    image: "الصورة",
    upload: "رفع",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    message: "الرسالة",

    // Dashboard
    totalServices: "إجمالي الخدمات",
    totalTestimonials: "إجمالي الشهادات",
    unreadMessages: "الرسائل غير المقروءة",
    totalProjects: "إجمالي المشاريع",

    // Settings
    language: "اللغة",
    theme: "المظهر",
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع الداكن",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",

    // Messages
    success: "نجح",
    error: "خطأ",
    warning: "تحذير",
    info: "معلومات",

    // Validation
    required: "هذا الحقل مطلوب",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    invalidPhone: "يرجى إدخال رقم هاتف صحيح",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Set RTL attribute on document element
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const isRTL = language === "ar";

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["en"]] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
