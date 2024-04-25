import { writable } from 'svelte/store';

export interface SearchStoreModel<T extends Record<PropertyKey, unknown>> {
	data: T[];
	filtered: T[];
	search: string | undefined;
	rubro?: string;
	descripcion?: string;
	marca?: string;
}

export const filterStore = writable('');
export const createSearchStore = <T extends Record<PropertyKey, unknown>>(data: T[]) => {
	const { subscribe, set, update } = writable<SearchStoreModel<T>>({
		data: data,
		filtered: data,
		search: '',
		rubro: '',
		marca: ''
	});

	return {
		subscribe,
		set,
		update
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const searchHandler = <T extends Record<PropertyKey, any>>(store: SearchStoreModel<T>) => {
	{
		const searchTerm: string = store.search?.toLowerCase();

		if (searchTerm) {
			const filterSearchSplited = searchTerm.split(' ');
			store.filtered = store.data.filter((item) => {
				let counter = 0;
				filterSearchSplited.forEach((word) => {
					if (item.searchTerms.toLowerCase().includes(word)) {
						counter++;
					}
				});
				if (item.searchTerms.toLowerCase().includes(filterSearchSplited.join(' '))) {
					console.log(item);
				}

				return counter === filterSearchSplited.length ? item : undefined;
			});
		} else {
			store.filtered = [];
		}
	}
};
