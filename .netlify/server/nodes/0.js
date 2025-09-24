import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DhCnxuTX.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/BJo4ZQj7.js","_app/immutable/chunks/B4tm4b0n.js","_app/immutable/chunks/CgUxjuS_.js","_app/immutable/chunks/D37he2ZV.js","_app/immutable/chunks/BuDUvo5C.js","_app/immutable/chunks/W88NFS7Z.js","_app/immutable/chunks/BckO1MTO.js","_app/immutable/chunks/B3CtTh1F.js","_app/immutable/chunks/C9PGmLv_.js","_app/immutable/chunks/BpINVYcp.js"];
export const stylesheets = ["_app/immutable/assets/0.CLmMlM8n.css"];
export const fonts = [];
