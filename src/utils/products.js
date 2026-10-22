import { normalizeText } from './format.js';

// Programação funcional: filter, map e reduce com arrays reais da aplicação.
export function filterProducts(products, { search = '', category = '', size = '', favorites = false, favoriteIds = [], sort = 'recent' } = {}) {
  const query = normalizeText(search);
  const list = products
    .filter(product => product.status === 'disponivel' && product.stock_quantity > 0)
    .filter(product => !category || product.category_id === category)
    .filter(product => !size || normalizeText(product.size) === normalizeText(size))
    .filter(product => !favorites || favoriteIds.includes(product.id))
    .filter(product => !query || [product.name, product.brand, product.color, product.description].some(value => normalizeText(value).includes(query)));

  const compare = {
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
    recent: (a, b) => b.created_at.localeCompare(a.created_at),
  };
  return [...list].sort(compare[sort] || compare.recent);
}

export function cartEntries(cart, products) {
  return cart
    .map(item => {
      const product = products.find(p => p.id === item.id);
      return product && product.status === 'disponivel' && product.stock_quantity > 0
        ? { ...product, quantity: Math.min(item.quantity, product.stock_quantity), subtotal: product.price * Math.min(item.quantity, product.stock_quantity) }
        : null;
    })
    .filter(Boolean);
}

export const cartTotal = entries => entries.reduce((sum, item) => sum + item.subtotal, 0);
export const stockAvailable = products => products.filter(p => p.status === 'disponivel').reduce((sum, p) => sum + p.stock_quantity, 0);
