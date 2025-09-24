import { ae as ssr_context, _ as sanitize_slots, $ as sanitize_props, a0 as fallback, a1 as attr_class, a2 as attr, a7 as attr_style, a4 as slot, a5 as bind_props, a3 as stringify, af as store_mutate, a8 as store_get, ag as store_set, ad as ensure_array_like, a9 as escape_html, ab as unsubscribe_stores } from "../../chunks/index2.js";
import { w as writable } from "../../chunks/index.js";
import "clsx";
import "../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
import { l as loadingStore, p as page } from "../../chunks/loadingStore.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function ProgressRadial($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    let classesBase;
    let value = fallback($$props["value"], () => void 0, true);
    let stroke = fallback($$props["stroke"], 40);
    let font = fallback($$props["font"], 56);
    let strokeLinecap = fallback($$props["strokeLinecap"], "butt");
    let transition = fallback($$props["transition"], "transition-[stroke-dashoffset]");
    let width = fallback($$props["width"], "w-36");
    let meter = fallback($$props["meter"], "stroke-surface-900 dark:stroke-surface-50");
    let track = fallback($$props["track"], "stroke-surface-500/30");
    let fill = fallback($$props["fill"], "fill-token");
    let labelledby = fallback($$props["labelledby"], "");
    const cBase = "progress-radial relative overflow-hidden";
    const cBaseTrack = "fill-transparent";
    const cBaseMeter = "fill-transparent -rotate-90 origin-[50%_50%]";
    const baseSize = 512;
    const radius = baseSize / 2 - stroke / 2;
    let circumference = radius;
    let dashoffset;
    function setProgress(percent) {
      circumference = radius * 2 * Math.PI;
      dashoffset = circumference - percent / 100 * circumference;
    }
    setProgress(0);
    classesBase = `${cBase} ${width} ${$$sanitized_props.class ?? ""}`;
    $$renderer2.push(`<figure${attr_class(`progress-radial ${stringify(classesBase)}`)} data-testid="progress-radial" role="meter"${attr("aria-labelledby", labelledby)}${attr("aria-valuenow", value || 0)}${attr("aria-valuetext", value ? `${value}%` : "Indeterminate Spinner")}${attr("aria-valuemin", 0)}${attr("aria-valuemax", 100)}><svg${attr("viewBox", `0 0 ${stringify(baseSize)} ${stringify(baseSize)}`)}${attr_class("rounded-full", void 0, { "animate-spin": value === void 0 })}><circle${attr_class(`progress-radial-track ${stringify(cBaseTrack)} ${stringify(track)}`)}${attr("stroke-width", stroke)}${attr("r", radius)} cx="50%" cy="50%"></circle><circle${attr_class(`progress-radial-meter ${stringify(cBaseMeter)} ${stringify(meter)} ${stringify(transition)}`)}${attr("stroke-width", stroke)}${attr("r", radius)} cx="50%" cy="50%"${attr("stroke-linecap", strokeLinecap)}${attr_style("", {
      "stroke-dasharray": `${stringify(circumference)} ${stringify(circumference)}`,
      "stroke-dashoffset": dashoffset
    })}></circle>`);
    if (value != void 0 && value >= 0 && $$slots.default) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-weight="bold"${attr("font-size", font)}${attr_class(`progress-radial-text ${stringify(fill)}`)}><!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></text>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></svg></figure>`);
    bind_props($$props, {
      value,
      stroke,
      font,
      strokeLinecap,
      transition,
      width,
      meter,
      track,
      fill,
      labelledby
    });
  });
}
const filterStore = writable("");
const createSearchStore = (data) => {
  const { subscribe, set, update } = writable({
    data,
    filtered: data,
    search: "",
    rubro: "",
    marca: ""
  });
  return {
    subscribe,
    set,
    update
  };
};
const searchHandler = (store) => {
  {
    const searchTerm = store.search?.toLowerCase();
    if (searchTerm) {
      const filterSearchSplited = searchTerm.split(" ");
      store.filtered = store.data.filter((item) => {
        let counter = 0;
        filterSearchSplited.forEach((word) => {
          if (item.searchTerms.toLowerCase().includes(word)) {
            counter++;
          }
        });
        return counter === filterSearchSplited.length ? item : void 0;
      });
    } else {
      store.filtered = [];
    }
  }
};
const gsrStore = writable([]);
function ProductContainer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let articulos = $$props["articulos"];
    let coeficients = $$props["coeficients"];
    const coef_3 = coeficients.find((coef) => coef.name === "coef_3")?.value ?? 1;
    const coef_6 = coeficients.find((coef) => coef.name === "coef_6")?.value ?? 1;
    const coef_efect = coeficients.find((coef) => coef.name === "coef_efect")?.value ?? 1;
    let filter;
    filterStore.subscribe((value) => {
      filter = value;
    });
    const searchStore = createSearchStore(articulos);
    const unsubscribe = searchStore.subscribe((model) => searchHandler(model));
    onDestroy(() => {
      unsubscribe();
    });
    function addThousandSeparator(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function truncarACentena(numero) {
      return Math.round(numero / 100) * 100;
    }
    function orderProducts(products) {
      products.sort(function(a, b) {
        if (a.DESCRIPCION_MARCA > b.DESCRIPCION_MARCA) {
          return 1;
        }
        if (a.DESCRIPCION_MARCA < b.DESCRIPCION_MARCA) {
          return -1;
        }
        if (a.DESCRIPCIONGRUPOSUPERRUBRO > b.DESCRIPCIONGRUPOSUPERRUBRO) {
          return 1;
        }
        if (a.DESCRIPCIONGRUPOSUPERRUBRO < b.DESCRIPCIONGRUPOSUPERRUBRO) {
          return -1;
        }
        if (a.DESCRIPCIONSUPERRUBRO > b.DESCRIPCIONSUPERRUBRO) {
          return 1;
        }
        if (a.DESCRIPCIONSUPERRUBRO < b.DESCRIPCIONSUPERRUBRO) {
          return -1;
        }
        if (a.DESCRIPCIONRUBRO > b.DESCRIPCIONRUBRO) {
          return 1;
        }
        if (a.DESCRIPCIONRUBRO < b.DESCRIPCIONRUBRO) {
          return -1;
        }
        return 0;
      });
      return products;
    }
    {
      if (filter.length > 0) {
        store_mutate($$store_subs ??= {}, "$searchStore", searchStore, store_get($$store_subs ??= {}, "$searchStore", searchStore).search = filter);
        store_set(filterStore, filter);
      } else {
        store_mutate($$store_subs ??= {}, "$searchStore", searchStore, store_get($$store_subs ??= {}, "$searchStore", searchStore).search = void 0);
        store_set(filterStore, "");
      }
    }
    $$renderer2.push(`<div class="md:w-1/2 md:mx-auto px-3"><label class="text-center text-lg mb-3" for="">Ingrese codigo o descripción del articulo</label> <input type="search" class="input" placeholder="Buscar"${attr("value", filter)}/></div> `);
    if (store_get($$store_subs ??= {}, "$searchStore", searchStore).filtered.length === 0 && filter.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="px-3 mt-5"><p class="text-2xl text-center mb-4">Sugerencias</p> <ul class="flex flex-col flex-wrap h-32 gap-1"><!--[-->`);
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$gsrStore", gsrStore));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let gsr = each_array[$$index];
        $$renderer2.push(`<li class="text-center"><a href="/">${escape_html(gsr.descripcion)}</a></li>`);
      }
      $$renderer2.push(`<!--]--></ul></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="table-container md:p-4 p-2">`);
    if (store_get($$store_subs ??= {}, "$searchStore", searchStore).filtered.length !== 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<table class="table table-fixed svelte-1gjubqq"><thead class="svelte-1gjubqq"><tr class="svelte-1gjubqq"><th class="svelte-1gjubqq">Descripcion</th><th class="svelte-1gjubqq">Marca</th><th class="svelte-1gjubqq">Precio Efectivo</th><th class="svelte-1gjubqq">Precio Tarjeta</th><th class="svelte-1gjubqq">Talles</th><th class="svelte-1gjubqq">Rubro</th><th class="svelte-1gjubqq">3 cuotas de</th><th class="svelte-1gjubqq">6 cuotas de</th><th class="svelte-1gjubqq">Codigo</th></tr></thead><tbody class="svelte-1gjubqq"><!--[-->`);
      const each_array_1 = ensure_array_like(orderProducts(store_get($$store_subs ??= {}, "$searchStore", searchStore).filtered));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let prod = each_array_1[$$index_1];
        $$renderer2.push(`<tr class="svelte-1gjubqq"><td class="svelte-1gjubqq">${escape_html(prod.NOMBRE)}</td><td class="svelte-1gjubqq">${escape_html(prod.DESCRIPCION_MARCA)}</td><td class="svelte-1gjubqq">$${escape_html(addThousandSeparator(truncarACentena(+prod.PRECIOVENTA * coef_efect)))}</td><td class="svelte-1gjubqq">$${escape_html(addThousandSeparator(truncarACentena(+prod.PRECIOVENTA)))}</td><td class="svelte-1gjubqq">${escape_html(prod.TALLES)}</td><td class="svelte-1gjubqq">${escape_html(prod.DESCRIPCIONRUBRO)}</td><td class="svelte-1gjubqq">$${escape_html(addThousandSeparator(truncarACentena((+prod.PRECIOVENTA * coef_3 / 3).toFixed(0))))}</td><td class="svelte-1gjubqq">$${escape_html(addThousandSeparator(truncarACentena((+prod.PRECIOVENTA * coef_6 / 6).toFixed(0))))}</td><td class="svelte-1gjubqq">${escape_html(prod.CODIGO_PRODUCTO)}</td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { articulos, coeficients, searchStore });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let data = $$props["data"];
    let tmp = data;
    tmp.token;
    let articulos = tmp.articulos;
    let tmp_1 = store_get($$store_subs ??= {}, "$page", page).data.coeficients, coeficients = tmp_1.coeficients;
    let loadingValue = 0;
    let loading = false;
    loadingStore.subscribe((value) => {
      loading = value;
      let interval;
      if (loading) {
        loadingValue = 0;
        interval = setInterval(() => loadingValue = loadingValue + 3, 500);
      } else {
        clearInterval(interval);
      }
    });
    {
      articulos = store_get($$store_subs ??= {}, "$page", page).data.articulos;
      coeficients = store_get($$store_subs ??= {}, "$page", page).data.coeficients;
    }
    $$renderer2.push(`<div class="flex flex-col gap-10"><div class="flex justify-center flex-col h-full p-3 mt-6"><div class="hidden fixed top-0" id="data-capture-view"></div> `);
    {
      $$renderer2.push("<!--[!-->");
      if (!loading) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="btn variant-filled-warning my-3 w-full h-12 mx-auto top-20"><span class="icon-[mdi--camera-outline] text-4xl"></span>Scanee codigo de barras</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (articulos && !loading) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!---->`);
      {
        ProductContainer($$renderer2, { articulos, coeficients });
      }
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p class="text-4xl text-center my-5 animate-bounce z-50 mb-5">Cargando articulos</p> <div class="z-40 w-full">`);
      ProgressRadial($$renderer2, {
        value: loadingValue,
        class: "mx-auto",
        stroke: 20,
        meter: "stroke-tertiary-500",
        track: "stroke-tertiary-500/30"
      });
      $$renderer2.push(`<!----></div> <div class="w-full h-full backdrop-blur-sm absolute"></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
