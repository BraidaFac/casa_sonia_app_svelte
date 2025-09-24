import { a as auth } from "../../../chunks/lucia.js";
import { LuciaError } from "lucia";
import { redirect } from "@sveltejs/kit";
import { E as ENDPOINT_API, A as API_DEVICE, a as API_PASSWORD, b as API_USER } from "../../../chunks/private.js";
const load = (async ({ locals, cookies }) => {
  const session = await locals.auth.validate();
  const token = cookies.get("Authorization");
  if (session && token) {
    throw redirect(302, "/");
  }
});
const actions = {
  default: async ({ request, locals, cookies, fetch }) => {
    const { username, password } = Object.fromEntries(await request.formData());
    try {
      const user = await auth.useKey("username", username.toLowerCase(), password);
      const session = await auth.createSession({ userId: user.userId, attributes: {} });
      const response = await fetch(`${ENDPOINT_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          username: API_USER,
          password: API_PASSWORD,
          deviceinfo: API_DEVICE
        })
      });
      if (response.status !== 200) {
        throw new Error();
      }
      const token = (await response.json()).token;
      cookies.set("Authorization", `Baerer ${token}`, { path: "/" });
      locals.auth.setSession(session);
      throw redirect(302, "/");
    } catch (err) {
      if (err instanceof LuciaError) {
        return {
          user: username,
          message: "Credenciales incorrectas"
        };
      } else {
        return {
          user: username,
          message: "ERROR : " + err.message
        };
      }
    }
  }
};
export {
  actions,
  load
};
