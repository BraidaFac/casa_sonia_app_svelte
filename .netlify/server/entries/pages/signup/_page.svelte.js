import { a1 as attr_class, a2 as attr, a6 as clsx, a9 as escape_html, ah as css_props, a5 as bind_props } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { L as Logo } from "../../../chunks/Logo.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let form = $$props["form"];
    $$renderer2.push(`<div class="mt-10"><div class="bg-form flex flex-row justify-center items-center">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-4 rounded-lg"><form method="POST" class="flex flex-col w-96 gap-1 items-center"><input${attr_class(clsx(form?.errors?.username ? "input variant-filled-error" : "input variant-filled-surface"))} title="Usuario" type="text" placeholder="Usuario"${attr("value", form?.data?.user ?? "")} name="username"/> `);
      if (form?.errors?.username) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="error svelte-kmqcod">${escape_html(form?.errors?.username[0])}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <input${attr_class(clsx(form?.errors?.password || form?.errors?.confirmPassword ? "variant-filled-error input" : "input variant-filled-surface"))} title="Password" type="password" placeholder="Contrasena"${attr("value", form?.data?.password ?? "")} name="password"/> `);
      if (form?.errors?.password) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="error svelte-kmqcod">${escape_html(form?.errors?.password[0])}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <input${attr_class(clsx(form?.errors?.confirmPassword ? "variant-filled-error input" : "input variant-filled-surface"))} title="Password" type="password" placeholder="Confirmar contrasena" aria-label="Password"${attr("value", form?.data?.confirmPassword ?? "")} name="confirmPassword"/> `);
      if (form?.errors?.confirmPassword) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="error svelte-kmqcod">${escape_html(form?.errors?.confirmPassword[0])}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (form?.message) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="error svelte-kmqcod">${escape_html(form?.message)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <button type="submit" class="btn variant-outline w-24">Registrar</button></form></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="logo">`);
    css_props($$renderer2, true, { "--logo-size": "20rem" }, () => {
      Logo($$renderer2);
    });
    $$renderer2.push(`</div></div></div>`);
    bind_props($$props, { form });
  });
}
export {
  _page as default
};
