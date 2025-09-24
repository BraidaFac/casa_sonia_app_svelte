import { a as auth } from "../../../chunks/lucia.js";
import { redirect } from "@sveltejs/kit";
const POST = async ({ locals, cookies }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/");
  }
  await auth.invalidateSession(session.sessionId);
  locals.auth.setSession(null);
  cookies.delete("Authorization", {
    path: "/"
  });
  throw redirect(302, "/");
};
export {
  POST
};
