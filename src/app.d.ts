// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}
}
/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import('./lucia.js').Auth;
	type DatabaseUserAttributes = {
		userid: string;
		username: string;
		rol: string;
	};
}

export {};
