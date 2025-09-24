import { API_ENDPOINTS } from '$lib/constants/api.constants';

/**
 * Servicio de autenticación
 */
export class AuthService {
	/**
	 * Realiza login y obtiene token
	 */
	static async login(
		fetch: typeof globalThis.fetch,
		username: string,
		password: string,
		deviceInfo: string
	): Promise<string> {
		const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				username,
				password,
				deviceinfo: deviceInfo
			})
		});

		if (!response.ok) {
			throw new Error('Failed to login');
		}

		const data = await response.json();
		return data.token;
	}

	/**
	 * Valida token existente
	 */
	static async validateToken(token: string): Promise<boolean> {
		try {
			const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token
				}
			});
			return response.ok;
		} catch {
			return false;
		}
	}

	/**
	 * Formatea token con prefijo Bearer
	 */
	static formatToken(token: string): string {
		return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
	}
}
