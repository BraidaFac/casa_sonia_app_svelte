import { writable } from 'svelte/store';

export interface SearchStoreModel<T extends Record<PropertyKey, any>> {
	data: T[];
	filtered: T[];
	search: string | undefined;
	rubro?: string;
	descripcion?: string;
	marca?: string;
}

export const createSearchStore = <T extends Record<PropertyKey, any>>(data: T[]) => {
	const { subscribe, set, update } = writable<SearchStoreModel<T>>({
		data: data,
		filtered: data,
		search: '',
		rubro: '',
		descripcion: '',
		marca: ''
	});

	return {
		subscribe,
		set,
		update
	};
};

export const searchHandler = <T extends Record<PropertyKey, any>>(store: SearchStoreModel<T>) => {
	{
		const searchCat = store.rubro?.toLowerCase() || '';
		const searchTerm = store.search?.toLowerCase();
		const searchBrand = store.marca?.toLowerCase() || '';
		const searchDescription = store.descripcion?.toLowerCase() || '';

		store.filtered = store.data.filter((item) => {
			return (
				item.DESCRIPCIONMARCA.toLowerCase().includes(searchBrand) &&
				item.searchTerms.toLowerCase().includes(searchCat) &&
				item.searchTerms.toLowerCase().includes(searchTerm) &&
				item.searchTerms.toLowerCase().includes(searchDescription)
			);
		});
	}
};
