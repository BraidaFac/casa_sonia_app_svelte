import type { Article } from '$lib/types/article.types';
import { writable } from 'svelte/store';

export interface SearchStoreModel<T extends Record<PropertyKey, unknown>> {
	data: T[];
	filtered: T[];
	search: string | undefined;
	rubro?: string;
	descripcion?: string;
	marca?: string;
}

export const createSearchStore = <T extends Record<PropertyKey, unknown>>() => {
	const { subscribe, set, update } = writable<SearchStoreModel<T>>({
		data: [],
		filtered: [],
		search: '',
		rubro: '',
		marca: ''
	});

	// Función interna para filtrar los datos
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const filterData = (state: SearchStoreModel<any>): any[] => {
		const searchTerm = state.search?.toLowerCase() || '';
		console.log(searchTerm);
		if (!searchTerm || searchTerm.length < 3) {
			return [];
		}

		const filterSearchSplited = searchTerm.split(' ');
		return state.data.filter((item) => {
			let counter = 0;
			filterSearchSplited.forEach((word) => {
				if (item.searchTerms?.toLowerCase().includes(word)) {
					counter++;
				}
			});
			return counter === filterSearchSplited.length;
		});
	};

	return {
		subscribe,
		set,
		update,
		// Método para actualizar solo el campo search y filtrar automáticamente
		setSearch: (searchValue: string) => {
			update((state) => {
				const newState = { ...state, search: searchValue };
				newState.filtered = filterData(newState);
				return newState;
			});
		},
		// Método para limpiar el search
		clearSearch: () => {
			update((state) => ({ ...state, search: '', filtered: [] }));
		},
		// Método para actualizar el rubro
		setRubro: (rubroValue: string) => {
			update((state) => {
				const newState = { ...state, rubro: rubroValue };
				newState.filtered = filterData(newState);
				return newState;
			});
		},
		// Método para actualizar la marca
		setMarca: (marcaValue: string) => {
			update((state) => {
				const newState = { ...state, marca: marcaValue };
				newState.filtered = filterData(newState);
				return newState;
			});
		},
		// Método para actualizar los datos y refiltrar si hay búsqueda activa
		setData: (data: T[]) => {
			update((state) => {
				const newState = { ...state, data };
				// Si hay una búsqueda activa, refiltrar con los nuevos datos
				if (state.search) {
					newState.filtered = filterData(newState);
				}
				return newState;
			});
		}
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const searchHandler = <T extends Record<PropertyKey, any>>(store: SearchStoreModel<T>) => {
	{
		const searchTerm: string = store.search?.toLowerCase();
		console.log(searchTerm);
		if (searchTerm) {
			const filterSearchSplited = searchTerm.split(' ');
			store.filtered = store.data.filter((item) => {
				let counter = 0;
				filterSearchSplited.forEach((word) => {
					if (item.searchTerms.toLowerCase().includes(word)) {
						counter++;
					}
				});

				return counter === filterSearchSplited.length ? item : undefined;
			});
		} else {
			store.filtered = [];
		}
	}
};

export const searchStore = createSearchStore<Article>();
