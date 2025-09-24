import { r as redisClientInit } from "../../../chunks/redis.js";
const POST = async ({ request }) => {
  const data = await request.json();
  const articulos = data.articulos;
  if (!articulos) return new Response("No hay articulos", { status: 400 });
  const client = await redisClientInit();
  try {
    await client.set("articulos", JSON.stringify(articulos), { EX: 60 * 60 * 20 });
    return new Response("success", { status: 200 });
  } catch (err) {
    return new Response("Error", { status: 500 });
  } finally {
    await client.disconnect();
  }
};
export {
  POST
};
