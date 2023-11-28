import { writable } from 'svelte/store';

export interface SearchStoreModel<T extends Record<PropertyKey, any>> {
	data: T[];
	filtered: T[];
	search: string | undefined;
	category?: string;
	description?: string;
	brand?: string;
}

export const createSearchStore = <T extends Record<PropertyKey, any>>(data: T[]) => {
	const { subscribe, set, update } = writable<SearchStoreModel<T>>({
		data: data,
		filtered: data,
		search: '',
		category: '',
		description: '',
		brand: ''
	});

	return {
		subscribe,
		set,
		update
	};
};

export const searchHandler = <T extends Record<PropertyKey, any>>(store: SearchStoreModel<T>) => {
	{
		const searchCat = store.category?.toLowerCase() || '';
		const searchTerm = store.search?.toLowerCase();
		const searchBrand = store.brand?.toLowerCase() || '';
		const searchDescription = store.description?.toLowerCase() || '';
		store.filtered = store.data.filter((item) => {
			return (
				item.brand.name.toLowerCase().includes(searchBrand) &&
				item.searchTerms.toLowerCase().includes(searchCat) &&
				item.searchTerms.toLowerCase().includes(searchTerm) &&
				item.searchTerms.toLowerCase().includes(searchDescription)
			);
		});
	}
};
