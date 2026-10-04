import type { MeshApi } from './client';
import { createHttpApi } from './http';
import { mockApi } from './mock/mockApi';

const baseUrl = import.meta.env.VITE_API_URL as string | undefined;

/** The API the app uses: the real service when VITE_API_URL is set, otherwise sample data. */
export const api: MeshApi = baseUrl ? createHttpApi(baseUrl) : mockApi;
export const usingSampleData = !baseUrl;
