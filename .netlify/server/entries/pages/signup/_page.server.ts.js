import { a as auth } from "../../../chunks/lucia.js";
import { redirect } from "@sveltejs/kit";
import { z, ZodError } from "zod";
const registerSchema = z.object({
  username: z.string({ required_error: "Ingrese el usuario" }).min(1, { message: "Ingrese el usuario" }).trim(),
  password: z.string({ required_error: "Ingrese su contraseña" }).max(20, { message: "La contraseña puede tener hasta 20 caracteres" }).trim(),
  confirmPassword: z.string({ required_error: "Confirme su contraseña" }).trim()
}).superRefine(({ password, confirmPassword }, context) => {
  if (password !== confirmPassword) {
    context.addIssue({
      code: "custom",
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"]
    });
  }
});
const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session || session?.user.rol !== "ADMIN") {
    throw redirect(302, "/");
  }
};
const actions = {
  default: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    try {
      const result = registerSchema.parse(formData);
      await auth.createUser({
        key: {
          providerId: "username",
          providerUserId: result.username.toLowerCase(),
          password: result.password
        },
        attributes: {
          username: result.username,
          rol: "USER"
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const { fieldErrors: errors } = error.flatten();
        return {
          data: { ...formData },
          errors
        };
      } else {
        return {
          message: "El usuario ya existe"
        };
      }
    }
    throw redirect(302, "/login");
  }
};
export {
  actions,
  load
};
