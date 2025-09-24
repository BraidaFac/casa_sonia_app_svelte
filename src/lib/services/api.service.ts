import { API_ENDPOINTS, REQUEST_TIMEOUT } from '$lib/constants/api.constants';
import type { ApiResponse } from '$lib/types/article.types';
import axios, { type AxiosInstance } from 'axios';

/**
 * Servicio base para operaciones de API
 */
class ApiService {
	private readonly baseURL: string;
	private readonly timeout: number;

	constructor(baseURL: string = API_ENDPOINTS.BASE_URL, timeout: number = REQUEST_TIMEOUT) {
		this.baseURL = baseURL;
		this.timeout = timeout;
	}

	/**
	 * Crea una instancia de axios configurada
	 */
	createInstance(token: string): AxiosInstance {
		return axios.create({
			baseURL: this.baseURL,
			timeout: this.timeout,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});
	}

	/**
	 * Realiza una petición GET
	 */
	async get<T>(endpoint: string, token: string): Promise<ApiResponse<T>> {
		const instance = this.createInstance(token);
		const response = await instance.get(endpoint);
		return response.data;
	}

	/**
	 * Realiza una petición POST
	 */
	async post<T>(endpoint: string, data: any, token: string): Promise<T> {
		const instance = this.createInstance(token);
		const response = await instance.post(endpoint, data);
		return response.data;
	}
}

export const apiService = new ApiService();
