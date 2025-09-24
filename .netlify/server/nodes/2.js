import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.DiokQclL.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/BJo4ZQj7.js","_app/immutable/chunks/B4tm4b0n.js","_app/immutable/chunks/D37he2ZV.js","_app/immutable/chunks/BuDUvo5C.js","_app/immutable/chunks/BckO1MTO.js","_app/immutable/chunks/B3CtTh1F.js","_app/immutable/chunks/W88NFS7Z.js","_app/immutable/chunks/CgUxjuS_.js"];
export const stylesheets = ["_app/immutable/assets/2.DZV-lEZX.css"];
export const fonts = [];
