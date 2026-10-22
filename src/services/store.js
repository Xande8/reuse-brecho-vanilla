import { seedProducts } from '../data/seed.js';

// Persistência exclusivamente no navegador, ISOLADA do projeto React/Supabase.
export const KEYS = Object.freeze({
  products: 'reuse_vanilla_etapa1_products',
  cart: 'reuse_vanilla_etapa1_cart',
  favorites: 'reuse_vanilla_etapa1_favorites',
  orders: 'reuse_vanilla_etapa1_orders',
});

// UUID em localhost/HTTPS; identificador local de fallback em origens sem contexto seguro.
const newId = () => globalThis.crypto?.randomUUID?.() || `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function read(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : fallback;
  } catch { return fallback; }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('reuse:changed', { detail: { key } }));
  } catch {
    throw new Error('Não foi possível salvar. O armazenamento do navegador pode estar cheio.');
  }
}

export function initializeStore() {
  if (localStorage.getItem(KEYS.products) === null) {
    write(KEYS.products, seedProducts.map(p => ({ ...p })));
  } else {
    // Substitui ilustrações antigas dos exemplos, sem alterar fotos enviadas ou produtos criados.
    const products = getProducts();
    const refreshed = products.map(product => {
      const example = seedProducts.find(p => p.id === product.id);
      const oldIllustration = /^\.\/assets\/[a-z-]+\.svg$/.test(product.image || '');
      return example && oldIllustration ? { ...product, image: example.image } : product;
    });
    if (products.some((product, index) => product.image !== refreshed[index].image)) {
      write(KEYS.products, refreshed);
    }
  }
  if (localStorage.getItem(KEYS.cart) === null) write(KEYS.cart, []);
  if (localStorage.getItem(KEYS.favorites) === null) write(KEYS.favorites, []);
  if (localStorage.getItem(KEYS.orders) === null) write(KEYS.orders, []);
}

export const getProducts = () => read(KEYS.products, []);
export const getCart = () => read(KEYS.cart, []);
export const getFavorites = () => read(KEYS.favorites, []);
export const getOrders = () => read(KEYS.orders, []);

export function saveProduct(input) {
  const products = getProducts();
  const now = new Date().toISOString();
  const id = input.id || newId();
  const existing = products.find(p => p.id === id);
  const product = {
    ...input,
    id,
    created_at: existing?.created_at || now,
    updated_at: now,
  };
  const next = existing ? products.map(p => p.id === id ? product : p) : [product, ...products];
  write(KEYS.products, next);
  return product;
}

export function deleteProduct(id) {
  // CRUD completo da ETAPA I; somente dados locais demonstrativos.
  write(KEYS.products, getProducts().filter(p => p.id !== id));
  write(KEYS.cart, getCart().filter(item => item.id !== id));
  write(KEYS.favorites, getFavorites().filter(fav => fav !== id));
}

export function setProductStatus(id, status) {
  const p = getProducts().find(item => item.id === id);
  if (!p) throw new Error('Peça não encontrada.');
  saveProduct({ ...p, status });
}

export function setFavorites(favorites) { write(KEYS.favorites, favorites); }
export function setCart(cart) { write(KEYS.cart, cart); }

export function placeDemoOrder({ name, whatsapp, payment, entries }) {
  const products = getProducts();
  if (!entries.length) throw new Error('O carrinho está vazio.');
  if (!['pix', 'dinheiro', 'debito', 'credito'].includes(payment)) throw new Error('Pagamento inválido.');
  for (const item of entries) {
    const current = products.find(p => p.id === item.id);
    if (!Number.isInteger(item.quantity) || item.quantity <= 0 || !current || current.status !== 'disponivel' || current.stock_quantity < item.quantity) {
      throw new Error('Uma peça ficou indisponível. Atualize o carrinho.');
    }
  }
  const now = new Date().toISOString();
  const orders = getOrders();
  const number = Math.max(0, ...orders.map(o => o.number)) + 1;
  const order = {
    id: newId(), number, name, whatsapp, payment, created_at: now,
    status: 'aguardando_confirmacao',
    items: entries.map(({ id, name: productName, quantity, price }) => ({ id, name: productName, quantity, price, subtotal: quantity * price })),
    total: entries.reduce((sum, item) => sum + item.subtotal, 0),
  };
  const updated = products.map(p => {
    const item = entries.find(i => i.id === p.id);
    if (!item) return p;
    const stock = p.stock_quantity - item.quantity;
    return { ...p, stock_quantity: stock, status: stock === 0 ? 'reservado' : p.status, updated_at: now };
  });
  write(KEYS.products, updated);
  write(KEYS.orders, [order, ...orders]);
  write(KEYS.cart, getCart().filter(c => !entries.some(i => i.id === c.id)));
  return order;
}

export function changeOrderStatus(id, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === id);
  if (!order) throw new Error('Pedido não encontrado.');
  if (!['aguardando_confirmacao', 'confirmado', 'separado', 'concluido', 'cancelado'].includes(status)) throw new Error('Status inválido.');
  if (['cancelado', 'concluido'].includes(order.status) && status !== order.status) {
    throw new Error('Pedidos encerrados não podem ser reabertos nesta demonstração.');
  }
  if (status === 'cancelado' && order.status !== 'cancelado') {
    const products = getProducts().map(p => {
      const item = order.items.find(i => i.id === p.id);
      if (!item) return p;
      const stock = p.stock_quantity + item.quantity;
      return { ...p, stock_quantity: stock, status: p.status === 'reservado' ? 'disponivel' : p.status };
    });
    write(KEYS.products, products);
  }
  if (status === 'concluido' && order.status !== 'concluido') {
    const products = getProducts().map(p => {
      if (order.items.some(i => i.id === p.id) && p.stock_quantity === 0) return { ...p, status: 'vendido' };
      return p;
    });
    write(KEYS.products, products);
  }
  write(KEYS.orders, orders.map(o => o.id === id ? { ...o, status } : o));
}

export function resetDemo() {
  write(KEYS.products, seedProducts.map(p => ({ ...p })));
  write(KEYS.cart, []);
  write(KEYS.favorites, []);
  write(KEYS.orders, []);
}
