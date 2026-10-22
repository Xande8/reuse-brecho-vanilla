export const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const niceDate = value => new Date(value).toLocaleString('pt-BR');
export const normalizeText = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const $ = id => document.getElementById(id);
export const field = (el, key) => String(el.elements.namedItem(key)?.value ?? '').trim();
