import { Y as setContext, Z as getContext, _ as sanitize_slots, $ as sanitize_props, a0 as fallback, a1 as attr_class, a2 as attr, a3 as stringify, a4 as slot, a5 as bind_props, a6 as clsx, a7 as attr_style, a8 as store_get, a9 as escape_html, aa as attributes, ab as unsubscribe_stores, ac as spread_props, ad as ensure_array_like } from "../../chunks/index2.js";
import "clsx";
import { w as writable } from "../../chunks/index.js";
import { p as prefersReducedMotionStore } from "../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { l as loadingStore, s as sideBarStatus, p as page } from "../../chunks/loadingStore.js";
import { arrow, flip, shift, offset, autoUpdate, computePosition } from "@floating-ui/dom";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const storePopup = writable(void 0);
const DRAWER_STORE_KEY = "drawerStore";
function initializeDrawerStore() {
  const drawerStore = drawerService();
  return setContext(DRAWER_STORE_KEY, drawerStore);
}
function drawerService() {
  const { subscribe, set, update } = writable({});
  return {
    subscribe,
    set,
    update,
    /** Open the drawer. */
    open: (newSettings) => update(() => {
      return { open: true, ...newSettings };
    }),
    /** Close the drawer. */
    close: () => update((d) => {
      d.open = false;
      return d;
    })
  };
}
const MODAL_STORE_KEY = "modalStore";
function getModalStore() {
  const modalStore = getContext(MODAL_STORE_KEY);
  if (!modalStore)
    throw new Error("modalStore is not initialized. Please ensure that `initializeStores()` is invoked in the root layout file of this app!");
  return modalStore;
}
function initializeModalStore() {
  const modalStore = modalService();
  return setContext(MODAL_STORE_KEY, modalStore);
}
function modalService() {
  const { subscribe, set, update } = writable([]);
  return {
    subscribe,
    set,
    update,
    /** Append to end of queue. */
    trigger: (modal) => update((mStore) => {
      mStore.push(modal);
      return mStore;
    }),
    /**  Remove first item in queue. */
    close: () => update((mStore) => {
      if (mStore.length > 0)
        mStore.shift();
      return mStore;
    }),
    /** Remove all items from queue. */
    clear: () => set([])
  };
}
const toastDefaults = { message: "Missing Toast Message", autohide: true, timeout: 5e3 };
const TOAST_STORE_KEY = "toastStore";
function initializeToastStore() {
  const toastStore = toastService();
  return setContext(TOAST_STORE_KEY, toastStore);
}
function randomUUID() {
  const random = Math.random();
  return Number(random).toString(32);
}
function toastService() {
  const { subscribe, set, update } = writable([]);
  const close = (id) => update((tStore) => {
    if (tStore.length > 0) {
      const index = tStore.findIndex((t) => t.id === id);
      const selectedToast = tStore[index];
      if (selectedToast) {
        if (selectedToast.callback)
          selectedToast.callback({ id, status: "closed" });
        if (selectedToast.timeoutId)
          clearTimeout(selectedToast.timeoutId);
        tStore.splice(index, 1);
      }
    }
    return tStore;
  });
  function handleAutoHide(toast) {
    if (toast.autohide === true) {
      return setTimeout(() => {
        close(toast.id);
      }, toast.timeout);
    }
  }
  return {
    subscribe,
    close,
    /** Add a new toast to the queue. */
    trigger: (toast) => {
      const id = randomUUID();
      update((tStore) => {
        if (toast && toast.callback)
          toast.callback({ id, status: "queued" });
        if (toast.hideDismiss)
          toast.autohide = true;
        const tMerged = { ...toastDefaults, ...toast, id };
        tMerged.timeoutId = handleAutoHide(tMerged);
        tStore.push(tMerged);
        return tStore;
      });
      return id;
    },
    /** Remain visible on hover */
    freeze: (index) => update((tStore) => {
      if (tStore.length > 0)
        clearTimeout(tStore[index].timeoutId);
      return tStore;
    }),
    /** Cancel remain visible on leave */
    unfreeze: (index) => update((tStore) => {
      if (tStore.length > 0)
        tStore[index].timeoutId = handleAutoHide(tStore[index]);
      return tStore;
    }),
    /** Remove all toasts from queue */
    clear: () => set([])
  };
}
function initializeStores() {
  initializeModalStore();
  initializeToastStore();
  initializeDrawerStore();
}
function cubic_out(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function split_css_unit(value) {
  const split = typeof value === "string" && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return split ? [parseFloat(split[1]), split[2] || "px"] : [
    /** @type {number} */
    value,
    "px"
  ];
}
function fly(node, { delay = 0, duration = 400, easing = cubic_out, x = 0, y = 0, opacity = 0 } = {}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const od = target_opacity * (1 - opacity);
  const [x_value, x_unit] = split_css_unit(x);
  const [y_value, y_unit] = split_css_unit(y);
  return {
    delay,
    duration,
    easing,
    css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x_value}${x_unit}, ${(1 - t) * y_value}${y_unit});
			opacity: ${target_opacity - od * u}`
  };
}
function AppBar($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    let classesBase, classesRowMain, classesRowHeadline, classesSlotLead, classesSlotDefault, classesSlotTrail;
    let background = fallback($$props["background"], "bg-surface-100-800-token");
    let border = fallback($$props["border"], "");
    let padding = fallback($$props["padding"], "p-4");
    let shadow = fallback($$props["shadow"], "");
    let spacing = fallback($$props["spacing"], "space-y-4");
    let gridColumns = fallback($$props["gridColumns"], "grid-cols-[auto_1fr_auto]");
    let gap = fallback($$props["gap"], "gap-4");
    let regionRowMain = fallback($$props["regionRowMain"], "");
    let regionRowHeadline = fallback($$props["regionRowHeadline"], "");
    let slotLead = fallback($$props["slotLead"], "");
    let slotDefault = fallback($$props["slotDefault"], "");
    let slotTrail = fallback($$props["slotTrail"], "");
    let label = fallback($$props["label"], "");
    let labelledby = fallback($$props["labelledby"], "");
    const cBase = "flex flex-col";
    const cRowMain = "grid items-center";
    const cRowHeadline = "";
    const cSlotLead = "flex-none flex justify-between items-center";
    const cSlotDefault = "flex-auto";
    const cSlotTrail = "flex-none flex items-center space-x-4";
    classesBase = `${cBase} ${background} ${border} ${spacing} ${padding} ${shadow} ${$$sanitized_props.class ?? ""}`;
    classesRowMain = `${cRowMain} ${gridColumns} ${gap} ${regionRowMain}`;
    classesRowHeadline = `${cRowHeadline} ${regionRowHeadline}`;
    classesSlotLead = `${cSlotLead} ${slotLead}`;
    classesSlotDefault = `${cSlotDefault} ${slotDefault}`;
    classesSlotTrail = `${cSlotTrail} ${slotTrail}`;
    $$renderer2.push(`<div${attr_class(`app-bar ${stringify(classesBase)}`)} data-testid="app-bar" role="toolbar"${attr("aria-label", label)}${attr("aria-labelledby", labelledby)}><div${attr_class(`app-bar-row-main ${stringify(classesRowMain)}`)}>`);
    if ($$slots.lead) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class(`app-bar-slot-lead ${stringify(classesSlotLead)}`)}><!--[-->`);
      slot($$renderer2, $$props, "lead", {}, null);
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div${attr_class(`app-bar-slot-default ${stringify(classesSlotDefault)}`)}><!--[-->`);
    slot($$renderer2, $$props, "default", {}, null);
    $$renderer2.push(`<!--]--></div> `);
    if ($$slots.trail) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class(`app-bar-slot-trail ${stringify(classesSlotTrail)}`)}><!--[-->`);
      slot($$renderer2, $$props, "trail", {}, null);
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if ($$slots.headline) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class(`app-bar-row-headline ${stringify(classesRowHeadline)}`)}><!--[-->`);
      slot($$renderer2, $$props, "headline", {}, null);
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      background,
      border,
      padding,
      shadow,
      spacing,
      gridColumns,
      gap,
      regionRowMain,
      regionRowHeadline,
      slotLead,
      slotDefault,
      slotTrail,
      label,
      labelledby
    });
  });
}
function AppShell($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    let classesBase, classesHeader, classesSidebarLeft, classesSidebarRight, classesPageHeader, classesPageContent, classesPageFooter, classesFooter;
    let scrollbarGutter = fallback($$props["scrollbarGutter"], "auto");
    let regionPage = fallback($$props["regionPage"], "");
    let slotHeader = fallback($$props["slotHeader"], "z-10");
    let slotSidebarLeft = fallback($$props["slotSidebarLeft"], "w-auto");
    let slotSidebarRight = fallback($$props["slotSidebarRight"], "w-auto");
    let slotPageHeader = fallback($$props["slotPageHeader"], "");
    let slotPageContent = fallback($$props["slotPageContent"], "");
    let slotPageFooter = fallback($$props["slotPageFooter"], "");
    let slotFooter = fallback($$props["slotFooter"], "");
    const cBaseAppShell = "w-full h-full flex flex-col overflow-hidden";
    const cContentArea = "w-full h-full flex overflow-hidden";
    const cPage = "flex-1 overflow-x-hidden flex flex-col";
    const cSidebarLeft = "flex-none overflow-x-hidden overflow-y-auto";
    const cSidebarRight = "flex-none overflow-x-hidden overflow-y-auto";
    classesBase = `${cBaseAppShell} ${$$sanitized_props.class ?? ""}`;
    classesHeader = `${slotHeader}`;
    classesSidebarLeft = `${cSidebarLeft} ${slotSidebarLeft}`;
    classesSidebarRight = `${cSidebarRight} ${slotSidebarRight}`;
    classesPageHeader = `${slotPageHeader}`;
    classesPageContent = `${slotPageContent}`;
    classesPageFooter = `${slotPageFooter}`;
    classesFooter = `${slotFooter}`;
    $$renderer2.push(`<div id="appShell"${attr_class(clsx(classesBase))} data-testid="app-shell">`);
    if ($$slots.header) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<header id="shell-header"${attr_class(`flex-none ${stringify(classesHeader)}`)}><!--[-->`);
      slot($$renderer2, $$props, "header", {}, null);
      $$renderer2.push(`<!--]--></header>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div${attr_class(`flex-auto ${stringify(cContentArea)}`)}>`);
    if ($$slots.sidebarLeft) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<aside id="sidebar-left"${attr_class(clsx(classesSidebarLeft))}><!--[-->`);
      slot($$renderer2, $$props, "sidebarLeft", {}, null);
      $$renderer2.push(`<!--]--></aside>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div id="page"${attr_class(`${stringify(regionPage)} ${stringify(cPage)}`)}${attr_style("", { "scrollbar-gutter": scrollbarGutter })}>`);
    if ($$slots.pageHeader) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<header id="page-header"${attr_class(`flex-none ${stringify(classesPageHeader)}`)}><!--[-->`);
      slot($$renderer2, $$props, "pageHeader", {}, () => {
        $$renderer2.push(`(slot:header)`);
      });
      $$renderer2.push(`<!--]--></header>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <main id="page-content"${attr_class(`flex-auto ${stringify(classesPageContent)}`)}><!--[-->`);
    slot($$renderer2, $$props, "default", {}, null);
    $$renderer2.push(`<!--]--></main> `);
    if ($$slots.pageFooter) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<footer id="page-footer"${attr_class(`flex-none ${stringify(classesPageFooter)}`)}><!--[-->`);
      slot($$renderer2, $$props, "pageFooter", {}, () => {
        $$renderer2.push(`(slot:footer)`);
      });
      $$renderer2.push(`<!--]--></footer>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if ($$slots.sidebarRight) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<aside id="sidebar-right"${attr_class(clsx(classesSidebarRight))}><!--[-->`);
      slot($$renderer2, $$props, "sidebarRight", {}, null);
      $$renderer2.push(`<!--]--></aside>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if ($$slots.footer) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<footer id="shell-footer"${attr_class(`flex-none ${stringify(classesFooter)}`)}><!--[-->`);
      slot($$renderer2, $$props, "footer", {}, null);
      $$renderer2.push(`<!--]--></footer>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      scrollbarGutter,
      regionPage,
      slotHeader,
      slotSidebarLeft,
      slotSidebarRight,
      slotPageHeader,
      slotPageContent,
      slotPageFooter,
      slotFooter
    });
  });
}
function Modal($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let cPosition, classesBackdrop, classesTransitionLayer, classesModal, parent;
    let components = fallback($$props["components"], () => ({}), true);
    let position = fallback($$props["position"], "items-center");
    let background = fallback($$props["background"], "bg-surface-100-800-token");
    let width = fallback($$props["width"], "w-modal");
    let height = fallback($$props["height"], "h-auto");
    let padding = fallback($$props["padding"], "p-4");
    let spacing = fallback($$props["spacing"], "space-y-4");
    let rounded = fallback($$props["rounded"], "rounded-container-token");
    let shadow = fallback($$props["shadow"], "shadow-xl");
    let zIndex = fallback($$props["zIndex"], "z-[999]");
    let buttonNeutral = fallback($$props["buttonNeutral"], "variant-ghost-surface");
    let buttonPositive = fallback($$props["buttonPositive"], "variant-filled");
    let buttonTextCancel = fallback($$props["buttonTextCancel"], "Cancel");
    let buttonTextConfirm = fallback($$props["buttonTextConfirm"], "Confirm");
    let buttonTextSubmit = fallback($$props["buttonTextSubmit"], "Submit");
    let regionBackdrop = fallback($$props["regionBackdrop"], "");
    let regionHeader = fallback($$props["regionHeader"], "text-2xl font-bold");
    let regionBody = fallback($$props["regionBody"], "max-h-[200px] overflow-hidden");
    let regionFooter = fallback($$props["regionFooter"], "flex justify-end space-x-2");
    let transitions = fallback($$props["transitions"], () => !store_get($$store_subs ??= {}, "$prefersReducedMotionStore", prefersReducedMotionStore), true);
    let transitionIn = fallback($$props["transitionIn"], fly);
    let transitionInParams = fallback($$props["transitionInParams"], () => ({ duration: 150, opacity: 0, x: 0, y: 100 }), true);
    let transitionOut = fallback($$props["transitionOut"], fly);
    let transitionOutParams = fallback($$props["transitionOutParams"], () => ({ duration: 150, opacity: 0, x: 0, y: 100 }), true);
    const cBackdrop = "fixed top-0 left-0 right-0 bottom-0 bg-surface-backdrop-token p-4";
    const cTransitionLayer = "w-full h-fit min-h-full overflow-y-auto flex justify-center";
    const cModal = "block overflow-y-auto";
    const cModalImage = "w-full h-auto";
    let promptValue;
    const buttonTextDefaults = { buttonTextCancel, buttonTextConfirm, buttonTextSubmit };
    let currentComponent;
    let modalElement;
    let windowHeight;
    let backdropOverflow = "overflow-y-hidden";
    const modalStore = getModalStore();
    function handleModals(modals) {
      if (modals[0].type === "prompt") promptValue = modals[0].value;
      buttonTextCancel = modals[0].buttonTextCancel || buttonTextDefaults.buttonTextCancel;
      buttonTextConfirm = modals[0].buttonTextConfirm || buttonTextDefaults.buttonTextConfirm;
      buttonTextSubmit = modals[0].buttonTextSubmit || buttonTextDefaults.buttonTextSubmit;
      currentComponent = typeof modals[0].component === "string" ? components[modals[0].component] : modals[0].component;
    }
    function onModalHeightChange(modal) {
      let modalHeight = modal?.clientHeight;
      if (!modalHeight) modalHeight = modal?.firstChild?.clientHeight;
      if (!modalHeight) return;
      if (modalHeight > windowHeight) {
        backdropOverflow = "overflow-y-auto";
      } else {
        backdropOverflow = "overflow-y-hidden";
      }
    }
    function onClose() {
      if (store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].response) store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].response(false);
      modalStore.close();
    }
    if (store_get($$store_subs ??= {}, "$modalStore", modalStore).length) handleModals(store_get($$store_subs ??= {}, "$modalStore", modalStore));
    onModalHeightChange(modalElement);
    cPosition = store_get($$store_subs ??= {}, "$modalStore", modalStore)[0]?.position ?? position;
    classesBackdrop = `${cBackdrop} ${regionBackdrop} ${zIndex} ${$$sanitized_props.class ?? ""} ${store_get($$store_subs ??= {}, "$modalStore", modalStore)[0]?.backdropClasses ?? ""}`;
    classesTransitionLayer = `${cTransitionLayer} ${cPosition ?? ""}`;
    classesModal = `${cModal} ${background} ${width} ${height} ${padding} ${spacing} ${rounded} ${shadow} ${store_get($$store_subs ??= {}, "$modalStore", modalStore)[0]?.modalClasses ?? ""}`;
    parent = {
      position,
      // ---
      background,
      width,
      height,
      padding,
      spacing,
      rounded,
      shadow,
      // ---
      buttonNeutral,
      buttonPositive,
      buttonTextCancel,
      buttonTextConfirm,
      buttonTextSubmit,
      // ---
      regionBackdrop,
      regionHeader,
      regionBody,
      regionFooter,
      // ---
      onClose
    };
    if (store_get($$store_subs ??= {}, "$modalStore", modalStore).length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!---->`);
      {
        $$renderer2.push(`<div${attr_class(`modal-backdrop ${stringify(classesBackdrop)} ${stringify(backdropOverflow)}`)} data-testid="modal-backdrop"><div${attr_class(`modal-transition ${stringify(classesTransitionLayer)}`)}>`);
        if (store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].type !== "component") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div${attr_class(`modal ${stringify(classesModal)}`)} data-testid="modal" role="dialog" aria-modal="true"${attr("aria-label", store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].title ?? "")}>`);
          if (store_get($$store_subs ??= {}, "$modalStore", modalStore)[0]?.title) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<header${attr_class(`modal-header ${stringify(regionHeader)}`)}>${html(store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].title)}</header>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (store_get($$store_subs ??= {}, "$modalStore", modalStore)[0]?.body) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<article${attr_class(`modal-body ${stringify(regionBody)}`)}>${html(store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].body)}</article>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (store_get($$store_subs ??= {}, "$modalStore", modalStore)[0]?.image && typeof store_get($$store_subs ??= {}, "$modalStore", modalStore)[0]?.image === "string") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<img${attr_class(`modal-image ${stringify(cModalImage)}`)}${attr("src", store_get($$store_subs ??= {}, "$modalStore", modalStore)[0]?.image)} alt="Modal"/>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].type === "alert") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<footer${attr_class(`modal-footer ${stringify(regionFooter)}`)}><button type="button"${attr_class(`btn ${stringify(buttonNeutral)}`)}>${escape_html(buttonTextCancel)}</button></footer>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].type === "confirm") {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<footer${attr_class(`modal-footer ${stringify(regionFooter)}`)}><button type="button"${attr_class(`btn ${stringify(buttonNeutral)}`)}>${escape_html(buttonTextCancel)}</button> <button type="button"${attr_class(`btn ${stringify(buttonPositive)}`)}>${escape_html(buttonTextConfirm)}</button></footer>`);
            } else {
              $$renderer2.push("<!--[!-->");
              if (store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].type === "prompt") {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<form class="space-y-4"><input${attributes(
                  {
                    class: "modal-prompt-input input",
                    name: "prompt",
                    type: "text",
                    value: promptValue,
                    ...store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].valueAttr
                  },
                  void 0,
                  void 0,
                  void 0,
                  4
                )}/> <footer${attr_class(`modal-footer ${stringify(regionFooter)}`)}><button type="button"${attr_class(`btn ${stringify(buttonNeutral)}`)}>${escape_html(buttonTextCancel)}</button> <button type="submit"${attr_class(`btn ${stringify(buttonPositive)}`)}>${escape_html(buttonTextSubmit)}</button></footer></form>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div${attr_class(`modal contents ${stringify(store_get($$store_subs ??= {}, "$modalStore", modalStore)[0]?.modalClasses ?? "")}`)} data-testid="modal-component" role="dialog" aria-modal="true"${attr("aria-label", store_get($$store_subs ??= {}, "$modalStore", modalStore)[0].title ?? "")}>`);
          if (currentComponent?.slot) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<!---->`);
            currentComponent?.ref?.($$renderer2, spread_props([
              currentComponent?.props,
              {
                parent,
                children: ($$renderer3) => {
                  $$renderer3.push(`${html(currentComponent?.slot)}`);
                },
                $$slots: { default: true }
              }
            ]));
            $$renderer2.push(`<!---->`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<!---->`);
            currentComponent?.ref?.($$renderer2, spread_props([currentComponent?.props, { parent }]));
            $$renderer2.push(`<!---->`);
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      components,
      position,
      background,
      width,
      height,
      padding,
      spacing,
      rounded,
      shadow,
      zIndex,
      buttonNeutral,
      buttonPositive,
      buttonTextCancel,
      buttonTextConfirm,
      buttonTextSubmit,
      regionBackdrop,
      regionHeader,
      regionBody,
      regionFooter,
      transitions,
      transitionIn,
      transitionInParams,
      transitionOut,
      transitionOutParams
    });
  });
}
function BurgerBar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let action_flag;
    let user = $$props["user"];
    loadingStore.subscribe((loadingValue) => {
    });
    getModalStore();
    action_flag = false;
    $$renderer2.push(`<div class="burger relative float-right">`);
    if (user && user.rol === "ADMIN") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="relative inline-block text-left"><div><button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-lg px-3 hover:bg-white hover:text-black py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300" id="menu-button" aria-expanded="true" aria-haspopup="true">Acciones</button></div> `);
      if (action_flag) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1"><div class="py-1" role="none"><a href="/" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Actualizar</a> <a href="/" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Cuotas</a> <form method="POST" action="/logout" role="none"><button type="submit" class="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Sign out</button></form></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<a href="/login">Login</a>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { user });
  });
}
function SideMenu($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let gsr = $$props["gsr"];
    let sr = $$props["sr"];
    let rubros = $$props["rubros"];
    let contentToShow = { content: gsr };
    $$renderer2.push(`<div${attr_class(`fixed  bg-gray-800 left-0 top-0 md:min-h-64 md:w-1/3  w-full h-full  rounded-md shadow-md  z-50 transform transition-transform ${store_get($$store_subs ??= {}, "$sideBarStatus", sideBarStatus) ? "translate-x-0" : "-translate-x-full"} overflow-auto`)}><div class="side-menu__header flex justify-between b p-3 items-center h-16" style="background-color: rgb(var(--color-surface-900))"><div>`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button><span class="icon-[ph--x-circle-fill] w-8 h-8"></span></button></div> <div class="side-menu__body p-3 rounded-lg py-5 h-full"><div class="flex justify-stretch gap-3 items-center mb-3"><h3 class="side-menu__title text-2xl">${escape_html(
      "CATEGORIAS"
    )}</h3> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <ul class="side-menu__list h-full"><!--[-->`);
    const each_array = ensure_array_like(contentToShow.content);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<li class="side-menu__item mb-1 mt-1"><a${attr("href", `#${stringify(item.id)}`)} class="side-menu__link text-gray-400">${escape_html(item.descripcion)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { gsr, sr, rubros });
  });
}
function Nav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let user = store_get($$store_subs ??= {}, "$page", page).data.user;
    store_get($$store_subs ??= {}, "$page", page).data.token;
    let sr = [];
    let gsr = [];
    let rubros = [];
    loadingStore.set(true);
    user = store_get($$store_subs ??= {}, "$page", page).data.user;
    AppBar($$renderer2, {
      background: "primary",
      gridColumns: "grid-cols-3",
      slotDefault: "place-self-center",
      slotTrail: "place-content-end",
      children: ($$renderer3) => {
        {
          $$renderer3.push(`<a href="/"><span class="icon svelte-1h32yp1"></span></a>`);
        }
      },
      $$slots: {
        default: true,
        lead: ($$renderer3) => {
          {
            if (!store_get($$store_subs ??= {}, "$loadingStore", loadingStore)) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div><a class="w-10" href="/"><div class="flex items-center"><span class="icon-[game-icons--hamburger-menu] w-10"></span><span>Menu</span></div></a> `);
              SideMenu($$renderer3, { gsr, sr, rubros });
              $$renderer3.push(`<!----></div>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]-->`);
          }
        },
        trail: ($$renderer3) => {
          {
            BurgerBar($$renderer3, { user });
          }
        }
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function ModalCoef($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const coeficients = store_get($$store_subs ??= {}, "$page", page).data.coeficients;
    console.log(coeficients);
    let coef_3 = coeficients.find((coef) => coef.name === "coef_3")?.value ?? 1;
    let coef_6 = coeficients.find((coef) => coef.name === "coef_6")?.value ?? 1;
    let coef_efect = coeficients.find((coef) => coef.name === "coef_efect")?.value ?? 1;
    getModalStore();
    const cBase = "card p-4 lg:w-1/3 shadow-xl space-y-4";
    const cHeader = "text-2xl font-bold text-center";
    const cForm = "border border-surface-500 p-4 space-y-4 rounded-container-token flex flex-col items-center";
    $$renderer2.push(`<div${attr_class(`modal-example-form ${stringify(cBase)}`)}>`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<header${attr_class(clsx(cHeader))}>Coeficientes</header> `);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<form${attr_class(`modal-form ${stringify(cForm)}`)}><label class="label"><span class="mr-5">Coeficiente efectivo</span> <input class="input inline w-20 lg:w-32" name="coef_efect" type="text"${attr("value", coef_efect)}/></label> <label class="label"><span class="mr-5">Coeficiente 3 cuotas</span> <input class="input inline w-20 lg:w-32" name="coef_3" type="text"${attr("value", coef_3)}/></label> <label class="label"><span class="mr-5">Coeficiente 6 cuotas</span> <input class="input inline w-20 lg:w-32" name="coef_6" type="text"${attr("value", coef_6)}/></label> <button class="variant-filled-success btn text-center">Guardar</button></form>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    initializeStores();
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
    const modalRegistry = { modalCoeficiente: { ref: ModalCoef } };
    getModalStore();
    AppShell($$renderer2, {
      children: ($$renderer3) => {
        Modal($$renderer3, { components: modalRegistry });
        $$renderer3.push(`<!----> <!--[-->`);
        slot($$renderer3, $$props, "default", {}, null);
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: {
        default: true,
        pageHeader: ($$renderer3) => {
          {
            Nav($$renderer3);
          }
        }
      }
    });
  });
}
export {
  _layout as default
};
