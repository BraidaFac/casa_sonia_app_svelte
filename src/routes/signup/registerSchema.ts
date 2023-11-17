import { z } from 'zod';

export const registerSchema = z
	.object({
		username: z
			.string({ required_error: 'Ingrese el usuario' })
			.min(1, { message: 'Ingrese el usuario' })
			.trim(),
		password: z
			.string({ required_error: 'Ingrese su contraseña' })
			.max(20, { message: 'La contraseña puede tener hasta 20 caracteres' })
			.trim(),
		confirmPassword: z.string({ required_error: 'Confirme su contraseña' }).trim()
	})
	.superRefine(({ password, confirmPassword }, context) => {
		if (password !== confirmPassword) {
			context.addIssue({
				code: 'custom',
				message: 'Las contraseñas no coinciden',
				path: ['confirmPassword']
			});
		}
	});
