import { PrismaClient } from "@prisma/client";
import { b as private_env } from "./shared-server.js";
const prismaClient = globalThis.__prisma || new PrismaClient();
if (private_env.NODE_ENV === "development") {
  globalThis.__prisma = prismaClient;
}
export {
  prismaClient as p
};
