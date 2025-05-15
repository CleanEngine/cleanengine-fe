import ky, { type ResponsePromise } from 'ky';

interface ApiClient {
	get<T>(url: string, init?: RequestInit): ResponsePromise<T>;
	post<T>(url: string, body?: BodyInit, init?: RequestInit): ResponsePromise<T>;
	put<T>(url: string, body?: BodyInit, init?: RequestInit): ResponsePromise<T>;
	delete<T>(url: string, init?: RequestInit): ResponsePromise<T>;
	patch<T>(
		url: string,
		body?: BodyInit,
		init?: RequestInit,
	): ResponsePromise<T>;
}

class ApiClientImpl implements ApiClient {
	private readonly client;

	constructor() {
		this.client = ky.create({
			prefixUrl: import.meta.env.VITE_API_URL,
			credentials: 'include',
		});
	}

	get<T>(url: string, init?: RequestInit): ResponsePromise<T> {
		return this.client.get(url, init);
	}

	post<T>(url: string, body?: unknown, init?: RequestInit): ResponsePromise<T> {
		return this.client.post(url, { ...init, json: body });
	}

	put<T>(url: string, body?: unknown, init?: RequestInit): ResponsePromise<T> {
		return this.client.put(url, { ...init, json: body });
	}

	delete<T>(url: string, init?: RequestInit): ResponsePromise<T> {
		return this.client.delete(url, init);
	}

	patch<T>(
		url: string,
		body?: unknown,
		init?: RequestInit,
	): ResponsePromise<T> {
		return this.client.patch(url, { ...init, json: body });
	}
}

export default new ApiClientImpl();
