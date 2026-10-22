import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { seedProducts } from '../src/data/seed.js';
import { filterProducts, cartEntries, cartTotal, stockAvailable } from '../src/utils/products.js';
import { initializeStore, getProducts, getCart, getOrders, saveProduct, deleteProduct, setCart, placeDemoOrder, changeOrderStatus, resetDemo } from '../src/services/store.js';

const entries = new Map();
globalThis.localStorage = {
  getItem: key => entries.has(key) ? entries.get(key) : null,
  setItem: (key, value) => entries.set(key, String(value)),
  removeItem: key => entries.delete(key),
};
globalThis.window = { dispatchEvent() {} };
beforeEach(() => { entries.clear(); initializeStore(); });

test('dados demonstrativos iniciam apenas na primeira abertura', () => {
  assert.equal(getProducts().length, 6);
  const product = getProducts()[0];
  saveProduct({ ...product, name: 'Personalizado' });
  initializeStore();
  assert.equal(getProducts()[0].name, 'Personalizado');
});

test('filter aplica disponibilidade, pesquisa sem acento, categoria e ordenação', () => {
  assert.equal(filterProducts(seedProducts, { search: 'calca' }).length, 1);
  assert.equal(filterProducts(seedProducts, { category: 'vestidos' }).length, 1);
  const ascending = filterProducts(seedProducts, { sort: 'priceAsc' });
  assert.equal(ascending[0].price, Math.min(...seedProducts.map(p => p.price)));
});

test('reduce totaliza carrinho e estoque disponível', () => {
  assert.equal(cartTotal(cartEntries([{ id: 'demo-1', quantity: 1 }], seedProducts)), 54.90);
  assert.equal(stockAvailable(seedProducts), 7);
});

test('CRUD: criar, ler, atualizar e excluir', () => {
  const payload = { name: 'Peça teste', category_id: 'blusas', price: 30, stock_quantity: 1, status: 'disponivel' };
  const created = saveProduct(payload);
  assert.equal(getProducts().length, 7);
  assert.equal(getProducts().find(p => p.id === created.id)?.name, 'Peça teste');
  saveProduct({ ...created, name: 'Peça editada' });
  assert.equal(getProducts().find(p => p.id === created.id)?.name, 'Peça editada');
  deleteProduct(created.id);
  assert.equal(getProducts().some(p => p.id === created.id), false);
});

test('pedido fictício diminui estoque; cancelamento devolve; nenhum pagamento real', () => {
  setCart([{ id: 'demo-1', quantity: 1 }]);
  const items = cartEntries(getCart(), getProducts());
  const order = placeDemoOrder({ name: 'Cliente teste', whatsapp: '83999999999', payment: 'pix', entries: items });
  assert.equal(order.total, 54.90);
  assert.equal(getOrders().length, 1);
  assert.equal(getProducts().find(p => p.id === 'demo-1').status, 'reservado');
  assert.equal(getCart().length, 0);
  changeOrderStatus(order.id, 'cancelado');
  assert.equal(getProducts().find(p => p.id === 'demo-1').stock_quantity, 1);
  assert.equal(getProducts().find(p => p.id === 'demo-1').status, 'disponivel');
});

test('pedido com estoque excedido é recusado', () => {
  assert.throws(() => placeDemoOrder({ name: 'Teste', whatsapp: '83999999999', payment: 'pix', entries: [{ id: 'demo-1', name: 'Teste', price: 3, quantity: 50, subtotal: 150 }] }), /indisponível/);
  assert.equal(getOrders().length, 0);
});

test('restaurar demo desfaz alterações locais', () => {
  deleteProduct('demo-1');
  resetDemo();
  assert.equal(getProducts().length, 6);
});


test('atualiza SVGs antigos apenas nos exemplos, preservando fotos personalizadas', () => {
  const old = getProducts();
  old[0].image = './assets/vestido.svg';
  old[1].image = 'data:image/webp;base64,teste';
  old[2].name = 'Calça renomeada';
  localStorage.setItem('reuse_vanilla_etapa1_products', JSON.stringify(old));
  initializeStore();
  const newer = getProducts();
  assert.equal(newer[0].image, './assets/vestido.webp');
  assert.equal(newer[1].image, 'data:image/webp;base64,teste');
  assert.equal(newer[2].name, 'Calça renomeada');
});

test('imagens fotográficas e páginas públicas estão organizadas', async () => {
  const { existsSync, readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  const root = resolve(import.meta.dirname, '..');
  for (const product of seedProducts) {
    assert.match(product.image, /^\.\/assets\/[a-z-]+\.webp$/);
    assert.equal(existsSync(resolve(root, 'public', product.image.slice(2))), true);
  }
  assert.equal(existsSync(resolve(root, 'public/assets/arara-roupas.webp')), true);
  for (const page of ['index.html', 'catalogo.html']) {
    const html = readFileSync(resolve(root, page), 'utf8');
    assert.doesNotMatch(html, /href="\.\/admin\.html"/);
  }
  assert.equal(existsSync(resolve(root, 'admin.html')), true);
});
