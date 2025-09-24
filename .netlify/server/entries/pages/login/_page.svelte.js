import { ah as css_props, a2 as attr, a9 as escape_html, a5 as bind_props } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { L as Logo } from "../../../chunks/Logo.js";
import "../../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let form = $$props["form"];
    $$renderer2.push(`<div><div class="bg-form flex flex-col p-2 md:flex-row md:justify-center md:items-center">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="logo">`);
      css_props($$renderer2, true, { "--logo-size": "20rem" }, () => {
        Logo($$renderer2);
      });
      $$renderer2.push(`</div> <div class="rounded-lg"><form method="POST" class="flex flex-col md:w-96 gap-1 items-center"><input class="input variant-filled-surface" title="Usuario" type="text" aria-label="User" placeholder="Usuario"${attr("value", form?.user ?? "")} name="username"/> <input class="input variant-filled-surface" title="Password" type="password" placeholder="Contrasena" aria-label="Password" name="password"/> `);
      if (form?.message) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="error svelte-1x05zx6">${escape_html(form?.message)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <button type="submit" class="btn variant-outline w-24">Ingresar</button></form></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { form });
  });
}
export {
  _page as default
};
