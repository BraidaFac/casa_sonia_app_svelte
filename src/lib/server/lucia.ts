// lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { prismaClient } from './prisma';
///const client = new PrismaClient();
export const auth = lucia({
	adapter: prisma(prismaClient, {
		user: 'authUser',
		session: 'authSession',
		key: 'authKey'
	}),
	sessionExpiresIn: { activePeriod: 60 * 60 * 24 * 1000, idlePeriod: 60 * 60 * 24 * 1000 },
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => ({
		userid: data.id,
		username: data.username,
		rol: data.rol
	})
});

export type Auth = typeof auth;
