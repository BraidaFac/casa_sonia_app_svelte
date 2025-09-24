import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { p as prismaClient } from "./prisma.js";
const auth = lucia({
  adapter: prisma(prismaClient, {
    user: "authUser",
    session: "authSession",
    key: "authKey"
  }),
  sessionExpiresIn: { activePeriod: 60 * 60 * 24 * 1e3, idlePeriod: 60 * 60 * 24 * 1e3 },
  env: "PROD",
  middleware: sveltekit(),
  getUserAttributes: (data) => ({
    userid: data.id,
    username: data.username,
    rol: data.rol
  })
});
export {
  auth as a
};
