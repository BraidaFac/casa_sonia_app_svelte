import type { Article } from '$lib/utils/types.utils';
import { writable } from 'svelte/store';

export const articleStore = writable<Article[]>([]);
