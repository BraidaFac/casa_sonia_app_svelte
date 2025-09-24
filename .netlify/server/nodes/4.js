import * as server from '../entries/pages/signup/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/signup/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/signup/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CiS8ffx1.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/BJo4ZQj7.js","_app/immutable/chunks/B4tm4b0n.js","_app/immutable/chunks/D37he2ZV.js","_app/immutable/chunks/BuDUvo5C.js","_app/immutable/chunks/BqCCj-Cu.js","_app/immutable/chunks/B3CtTh1F.js","_app/immutable/chunks/BpINVYcp.js","_app/immutable/chunks/W88NFS7Z.js"];
export const stylesheets = ["_app/immutable/assets/Logo.xjJgy1gq.css","_app/immutable/assets/4.MQvS9PZz.css"];
export const fonts = [];
