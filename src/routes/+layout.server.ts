import { prismaClient } from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	depends('app:layout');
	try {
		const session = await locals.auth.validate();
		const coeficients = await prismaClient.coeficient.findMany();

		return {
			user: session?.user,
			coeficients: coeficients.length
				? coeficients
				: [
						{ name: 'coef_efect', value: 0 },
						{
							name: 'coef_3',
							value: 1
						},
						{
							name: 'coef_6',
							value: 1
						}
					]
		};
	} catch (err) {
		throw new Error(err);
	}
};
