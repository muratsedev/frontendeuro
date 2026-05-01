import axios from 'axios';
import { AllArticles, AllCategories, Video } from '../types/Articles';
import { BACKEND_API_URL } from './config';

// Use centralized backend URL configuration
const BASE_URL = BACKEND_API_URL;

axios.defaults.timeout = 30000; // Increased timeout to 30 seconds

export const getArticles = async (): Promise<AllArticles[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/api/Articles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Unable to connect to the API server. Please make sure the backend server is running on port 7065.');
            }
            if (error.response) {
                throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
            }
            if (error.request) {
                throw new Error('Network Error: Unable to reach the API server. Please check your connection.');
            }
        }
        throw error;
    }
};

export const getCategories = async (): Promise<AllCategories[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/api/Categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Unable to connect to the API server. Please make sure the backend server is running on port 7065.');
            }
            if (error.response) {
                throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
            }
            if (error.request) {
                throw new Error('Network Error: Unable to reach the API server. Please check your connection.');
            }
        }
        throw error;
    }
};

// Update categoriesApi to use the correct functions
export const categoriesApi = {
  getAll: () => getCategories(),
  getById: async (id: number): Promise<AllCategories | undefined> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },
};

// Add articlesApi for consistency
export const articlesApi = {
  getAll: () => getArticles(),
  getById: async (id: string): Promise<AllArticles> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Articles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },
  getByCategory: async (categoryId: number): Promise<AllArticles[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Articles/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      throw error;
    }
  },
  getEditorChoice: async (): Promise<AllArticles[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Articles/EditorChoice`);
      return response.data;
    } catch (error) {
      console.error('Error fetching editor choice articles:', error);
      throw error;
    }
  },
};

// Add videosApi
export const videosApi = {
  getAll: async (): Promise<Video[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Videos`);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },
  getById: async (id: number): Promise<Video> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Videos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  },
};
