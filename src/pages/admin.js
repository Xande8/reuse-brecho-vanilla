import { categories, getCategoryName } from '../data/categories.js';
import { initializeStore, getProducts, getOrders, saveProduct, deleteProduct, setProductStatus, changeOrderStatus, resetDemo } from '../services/store.js';
import { stockAvailable } from '../utils/products.js';
import { $, field, money, niceDate } from '../utils/format.js';
import { element, button, emptyMessage } from '../components/dom.js';

initializeStore();
const form = $('productForm');
const adminTabs = document.querySelectorAll('.admin-tab');

function showTab(name) {
  adminTabs.forEach(tab => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${name}`));
  if (name === 'pecas') renderProducts();
  if (name === 'pedidos') renderOrders();
}

function feedback(text, success = false) {
  $('productFeedback').textContent = text;
  $('productFeedback').classList.toggle('success', success);
}

function resetForm() {
  form.reset();
  $('productId').value = '';
  $('stock').value = 1;
  $('productStatus').value = 'disponivel';
  $('currentPhoto').replaceChildren();
  $('formTitle').textContent = 'Cadastrar nova peça';
  feedback('');
}

function editProduct(id) {
  const product = getProducts().find(p => p.id === id);
  if (!product) return;
  resetForm();
  $('productId').value = product.id;
  ['name', 'price', 'size', 'brand', 'color', 'state', 'material', 'description'].forEach(key => { $(key).value = product[key] ?? ''; });
  $('category').value = product.category_id;
  $('stock').value = product.stock_quantity;
  $('productStatus').value = product.status;
  if (product.image) $('currentPhoto').replaceChildren(element('img', { attrs: { src: product.image, alt: 'Foto atual' } }));
  $('formTitle').textContent = 'Editar peça';
  showTab('cadastro');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function confirmDelete(id) {
  const product = getProducts().find(p => p.id === id);
  if (!product) return;
  if (!window.confirm(`Excluir "${product.name}" dos dados locais de demonstração? Essa ação não pode ser desfeita.`)) return;
  deleteProduct(id);
  renderEverything();
}

function selectStatus(product) {
  const select = element('select', { className: 'status-select', attrs: { 'aria-label': `Status da peça ${product.name}` } });
  const options = [['disponivel', 'Disponível'], ['indisponivel', 'Indisponível'], ['reservado', 'Reservado'], ['vendido', 'Vendido']];
  select.append(...options.map(([value, text]) => element('option', { text, attrs: { value } })));
  select.value = product.status;
  select.addEventListener('change', e => {
    try { setProductStatus(product.id, e.target.value); renderEverything(); }
    catch (error) { window.alert(error.message); renderEverything(); }
  });
  return select;
}

function productNode(p) {
  const row = element('article', { className: 'admin-product-card' });
  row.appendChild(element('img', { attrs: { src: p.image || './assets/logo.png', alt: p.name, loading: 'lazy' } }));
  const details = element('div', { className: 'admin-product-info' });
  details.appendChild(element('span', { className: 'eyebrow', text: getCategoryName(p.category_id) }));
  details.appendChild(element('h3', { text: p.name }));
  details.appendChild(element('p', { className: 'subtle', text: `${money(p.price)} · Tam. ${p.size} · Estoque ${p.stock_quantity}` }));
  row.appendChild(details);
  const actions = element('div', { className: 'admin-actions' });
  actions.appendChild(selectStatus(p));
  actions.appendChild(button('Editar', () => editProduct(p.id), 'pill-btn outline'));
  actions.appendChild(button('Excluir', () => confirmDelete(p.id), 'pill-btn danger'));
  row.appendChild(actions);
  return row;
}

function renderProducts() {
  const products = getProducts();
  $('adminProductList').replaceChildren(...(products.length ? products.map(productNode) : [emptyMessage('Nenhuma peça cadastrada.', 'Cadastrar primeira peça', () => { resetForm(); showTab('cadastro'); })]));
}

const statusLabels = { aguardando_confirmacao: 'Aguardando confirmação', confirmado: 'Confirmado', separado: 'Separado', concluido: 'Concluído', cancelado: 'Cancelado' };
const paymentLabels = { pix: 'PIX', dinheiro: 'Dinheiro', debito: 'Débito', credito: 'Crédito' };

function orderNode(o) {
  const node = element('article', { className: 'order-card' });
  const heading = element('div', { className: 'order-heading' }, [
    element('div', {}, [element('span', { className: 'eyebrow', text: `PEDIDO DEMO #${o.number}` }), element('h3', { text: o.name })]),
    element('strong', { text: money(o.total) }),
  ]);
  node.appendChild(heading);
  node.appendChild(element('p', { className: 'subtle', text: `${niceDate(o.created_at)} · ${paymentLabels[o.payment]} · ${o.whatsapp}` }));
  const list = element('ul', { className: 'order-products' });
  list.append(...o.items.map(i => element('li', { text: `${i.quantity}× ${i.name} — ${money(i.subtotal)}` })));
  node.appendChild(list);
  const bottom = element('div', { className: 'order-controls' });
  const select = element('select', { attrs: { 'aria-label': `Status do pedido ${o.number}` } });
  select.append(...Object.entries(statusLabels).map(([value, text]) => element('option', { text, attrs: { value } })));
  select.value = o.status;
  select.disabled = ['cancelado', 'concluido'].includes(o.status);
  select.addEventListener('change', e => {
    try { changeOrderStatus(o.id, e.target.value); renderEverything(); }
    catch (error) { window.alert(error.message); renderEverything(); }
  });
  bottom.appendChild(select);
  bottom.appendChild(element('span', { className: 'microcopy', text: 'Pedidos de teste não são enviados à loja.' }));
  node.appendChild(bottom);
  return node;
}

function renderOrders() {
  const orders = getOrders();
  $('adminOrderList').replaceChildren(...(orders.length ? orders.map(orderNode) : [emptyMessage('Nenhum pedido de demonstração ainda. Abra o catálogo, monte uma sacola e simule um pedido.') ]));
}

function renderStats() {
  const products = getProducts();
  const orders = getOrders();
  $('statAvailable').textContent = stockAvailable(products);
  $('statProducts').textContent = products.length;
  $('statOrders').textContent = orders.length;
  // Programação funcional: reduce para totalizar pedidos simulados.
  $('statRevenue').textContent = money(orders.filter(o => o.status !== 'cancelado').reduce((sum, o) => sum + o.total, 0));
}

function renderEverything() { renderStats(); renderProducts(); renderOrders(); }

function readSmallImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) { resolve(null); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { reject(new Error('A foto deve ser JPG, PNG ou WebP.')); return; }
    if (file.size > 350 * 1024) { reject(new Error('A foto deve ter até 350 KB no modo LocalStorage.')); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = field(form, 'name');
  const category = field(form, 'category');
  const price = Number(field(form, 'price'));
  const stock = Number(field(form, 'stock'));
  const size = field(form, 'size');
  if (name.length < 2 || name.length > 120) { feedback('Informe um nome válido.'); return; }
  if (!categories.some(c => c.id === category)) { feedback('Selecione uma categoria válida.'); return; }
  if (!Number.isFinite(price) || price <= 0 || price > 99999) { feedback('Informe um preço maior que zero.'); return; }
  if (!Number.isInteger(stock) || stock < 0 || stock > 1000) { feedback('Informe um estoque inteiro entre 0 e 1000.'); return; }
  if (!size) { feedback('Informe um tamanho.'); return; }
  const id = $('productId').value;
  const existing = getProducts().find(p => p.id === id);
  $('saveProduct').disabled = true;
  try {
    const image = await readSmallImage($('imageUpload').files[0]) || existing?.image || './assets/logo.png';
    const status = stock === 0 && $('productStatus').value === 'disponivel' ? 'indisponivel' : $('productStatus').value;
    saveProduct({ id: id || undefined, name, category_id: category, price, size, stock_quantity: stock, status,
      brand: field(form, 'brand'), color: field(form, 'color'), state: field(form, 'state'),
      material: field(form, 'material'), description: field(form, 'description'), image });
    resetForm();
    renderEverything();
    showTab('pecas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) { feedback(error.message); }
  finally { $('saveProduct').disabled = false; }
});

$('category').append(...categories.map(c => element('option', { text: c.name, attrs: { value: c.id } })));
adminTabs.forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.tab)));
$('newProduct').addEventListener('click', () => { resetForm(); showTab('cadastro'); });
$('clearForm').addEventListener('click', resetForm);
$('resetDemo').addEventListener('click', () => {
  if (!window.confirm('Restaurar os produtos de demonstração? Todos os produtos, pedidos, favoritos e carrinho locais serão substituídos.')) return;
  resetDemo(); resetForm(); renderEverything(); showTab('pecas');
});
$('imageUpload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const preview = element('img', { attrs: { src: url, alt: 'Prévia da foto selecionada' } });
  preview.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
  $('currentPhoto').replaceChildren(preview);
});
window.addEventListener('storage', renderEverything);
renderEverything();
