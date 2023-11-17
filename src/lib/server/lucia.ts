// lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();
export const auth = lucia({
	adapter: prisma(client, {
		user: 'authUser',
		session: 'authSession',
		key: 'authKey'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => ({
		userid: data.id,
		username: data.username,
		rol: data.rol
	})
});

export type Auth = typeof auth;
