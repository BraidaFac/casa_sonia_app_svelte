import { R as REDIS_HOST, c as REDIS_PASSWORD } from "./private.js";
import { createClient } from "redis";
const redisClientInit = async () => {
  const client = createClient({
    password: REDIS_PASSWORD,
    socket: {
      host: REDIS_HOST,
      port: 11786
    }
  });
  client.on("error", (error) => {
  });
  client.connect();
  return client;
};
export {
  redisClientInit as r
};
