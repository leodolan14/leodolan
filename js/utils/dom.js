/** Tiny query-selector shorthands. */
export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/**
 * Clones a `<template>` element's content and fills text nodes matching
 * `[data-field]` from a plain object. Keeps list rendering free of any
 * string-templating library.
 */
export function fillTemplate(template, data) {
  const node = template.content.firstElementChild.cloneNode(true);
  qsa("[data-field]", node).forEach((el) => {
    const key = el.dataset.field;
    if (key in data) el.textContent = data[key];
  });
  return node;
}
