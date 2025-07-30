const BASE_URL = "https://www.test.nia.com.eg/imic/public/api";

export interface Service {
  id?: number;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  img?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AboutUs {
  id?: number;
  mission_ar: string;
  mission_en: string;
  vision_ar: string;
  vision_en: string;
  desc_ar: string;
  desc_en: string;
  img?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface WhyChooseUs {
  id?: number;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id?: number;
  name_ar: string;
  name_en: string;
  img?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id?: number;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id?: number;
  category_id: number;
  title_ar: string;
  title_en: string;
  cover?: string | null;
  images?: string[] | null;
  video?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id?: number;
  name: string;
  text: string;
  num_star: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  phone: string;
  type_unit: string;
  location: string;
  msg: string;
  created_at?: string;
  updated_at?: string;
}

export interface News {
  id?: number;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  keyword_en: string;
  keyword_ar: string;
  content_en: string;
  content_ar: string;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

// Generic request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Services API
export const servicesApi = {
  // Get all services
  getServices: (): Promise<ApiResponse<Service[]>> => {
    return apiRequest<Service[]>("/services");
  },

  // Get single service
  getService: (id: number): Promise<ApiResponse<Service>> => {
    return apiRequest<Service>(`/services/${id}`);
  },

  // Create new service
  createService: (serviceData: FormData): Promise<ApiResponse<Service>> => {
    return apiRequest<Service>("/services", {
      method: "POST",
      body: serviceData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Update service
  updateService: (
    id: number,
    serviceData: FormData
  ): Promise<ApiResponse<Service>> => {
    return apiRequest<Service>(`/services/${id}?_method=PATCH`, {
      method: "POST", // Using POST for update with FormData
      body: serviceData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Delete service
  deleteService: (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/services/${id}`, {
      method: "DELETE",
    });
  },
};

// About Us API
export const aboutUsApi = {
  // Get about us content (returns first item from array)
  getAboutUs: async (): Promise<ApiResponse<AboutUs | null>> => {
    const response = await apiRequest<AboutUs[]>("/aboutus");
    return {
      ...response,
      data: response.data.length > 0 ? response.data[0] : null,
    };
  },

  // Create new about us content
  createAboutUs: (aboutUsData: FormData): Promise<ApiResponse<AboutUs>> => {
    return apiRequest<AboutUs>("/aboutus", {
      method: "POST",
      body: aboutUsData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Update about us content
  updateAboutUs: (
    id: number,
    aboutUsData: FormData
  ): Promise<ApiResponse<AboutUs>> => {
    return apiRequest<AboutUs>(`/aboutus/${id}?_method=PATCH`, {
      method: "POST",
      body: aboutUsData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },
};

// Why Choose Us API
export const whyChooseUsApi = {
  // Get all why choose us items
  getWhyChooseUs: (): Promise<ApiResponse<WhyChooseUs[]>> => {
    return apiRequest<WhyChooseUs[]>("/whyus");
  },

  // Get single why choose us item
  getWhyChooseUsItem: (id: number): Promise<ApiResponse<WhyChooseUs>> => {
    return apiRequest<WhyChooseUs>(`/whyus/${id}`);
  },

  // Create new why choose us item
  createWhyChooseUs: (
    whyChooseUsData: FormData
  ): Promise<ApiResponse<WhyChooseUs>> => {
    return apiRequest<WhyChooseUs>("/whyus", {
      method: "POST",
      body: whyChooseUsData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Update why choose us item
  updateWhyChooseUs: (
    id: number,
    whyChooseUsData: FormData
  ): Promise<ApiResponse<WhyChooseUs>> => {
    return apiRequest<WhyChooseUs>(`/whyus/${id}?_method=PATCH`, {
      method: "POST",
      body: whyChooseUsData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Delete why choose us item
  deleteWhyChooseUs: (
    id: number
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/whyus/${id}`, {
      method: "DELETE",
    });
  },
};

// Clients API
export const clientsApi = {
  // Get all clients
  getClients: (): Promise<ApiResponse<Client[]>> => {
    return apiRequest<Client[]>("/clients");
  },

  // Get single client
  getClient: (id: number): Promise<ApiResponse<Client>> => {
    return apiRequest<Client>(`/clients/${id}`);
  },

  // Create new client
  createClient: (clientData: FormData): Promise<ApiResponse<Client>> => {
    return apiRequest<Client>("/clients", {
      method: "POST",
      body: clientData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Update client
  updateClient: (
    id: number,
    clientData: FormData
  ): Promise<ApiResponse<Client>> => {
    return apiRequest<Client>(`/clients/${id}?_method=PATCH`, {
      method: "POST",
      body: clientData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Delete client
  deleteClient: (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/clients/${id}`, {
      method: "DELETE",
    });
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getCategories: (): Promise<ApiResponse<Category[]>> => {
    return apiRequest<Category[]>("/categories");
  },

  // Get single category
  getCategory: (id: number): Promise<ApiResponse<Category>> => {
    return apiRequest<Category>(`/categories/${id}`);
  },

  // Create new category
  createCategory: (categoryData: FormData): Promise<ApiResponse<Category>> => {
    return apiRequest<Category>("/categories", {
      method: "POST",
      body: categoryData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Update category
  updateCategory: (
    id: number,
    categoryData: FormData
  ): Promise<ApiResponse<Category>> => {
    return apiRequest<Category>(`/categories/${id}?_method=PATCH`, {
      method: "POST",
      body: categoryData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Delete category
  deleteCategory: (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// Projects API
export const projectsApi = {
  // Get all projects
  getProjects: (): Promise<ApiResponse<Project[]>> => {
    return apiRequest<Project[]>("/projects");
  },

  // Get single project
  getProject: (id: number): Promise<ApiResponse<Project>> => {
    return apiRequest<Project>(`/projects/${id}`);
  },

  // Create new project
  createProject: (projectData: FormData): Promise<ApiResponse<Project>> => {
    return apiRequest<Project>("/projects", {
      method: "POST",
      body: projectData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Update project
  updateProject: (
    id: number,
    projectData: FormData
  ): Promise<ApiResponse<Project>> => {
    return apiRequest<Project>(`/projects/${id}?_method=PATCH`, {
      method: "POST",
      body: projectData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Delete project
  deleteProject: (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/projects/${id}`, {
      method: "DELETE",
    });
  },
};

// Reviews API
export const reviewsApi = {
  // Get all reviews
  getReviews: (): Promise<ApiResponse<Review[]>> => {
    return apiRequest<Review[]>("/reviews");
  },

  // Get single review
  getReview: (id: number): Promise<ApiResponse<Review>> => {
    return apiRequest<Review>(`/reviews/${id}`);
  },

  // Create new review
  createReview: (reviewData: FormData): Promise<ApiResponse<Review>> => {
    return apiRequest<Review>("/reviews", {
      method: "POST",
      body: reviewData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Update review
  updateReview: (
    id: number,
    reviewData: FormData
  ): Promise<ApiResponse<Review>> => {
    return apiRequest<Review>(`/reviews/${id}?_method=PATCH`, {
      method: "POST",
      body: reviewData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Delete review
  deleteReview: (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/reviews/${id}`, {
      method: "DELETE",
    });
  },
};

// Contact Messages API
export const contactMessagesApi = {
  // Get all contact messages
  getContactMessages: (): Promise<ApiResponse<ContactMessage[]>> => {
    return apiRequest<ContactMessage[]>("/contactus");
  },

  // Get single contact message
  getContactMessage: (id: number): Promise<ApiResponse<ContactMessage>> => {
    return apiRequest<ContactMessage>(`/contactus/${id}`);
  },

  // Delete contact message
  deleteContactMessage: (
    id: number
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/contactus/${id}`, {
      method: "DELETE",
    });
  },
};

// News API
export const newsApi = {
  // Get all news
  getNews: (): Promise<ApiResponse<News[]>> => {
    return apiRequest<News[]>("/news");
  },

  // Get single news
  getNewsItem: (id: number): Promise<ApiResponse<News>> => {
    return apiRequest<News>(`/news/${id}`);
  },

  // Create new news
  createNews: (newsData: FormData): Promise<ApiResponse<News>> => {
    return apiRequest<News>("/news", {
      method: "POST",
      body: newsData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Update news
  updateNews: (id: number, newsData: FormData): Promise<ApiResponse<News>> => {
    return apiRequest<News>(`/news/${id}?_method=PATCH`, {
      method: "POST",
      body: newsData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
  },

  // Delete news
  deleteNews: (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>(`/news/${id}`, {
      method: "DELETE",
    });
  },
};
