import { categories } from '../data/categories.js';
import { initializeStore, getProducts, getCart, setCart, getFavorites, setFavorites, placeDemoOrder } from '../services/store.js';
import { filterProducts, cartEntries, cartTotal } from '../utils/products.js';
import { $, money } from '../utils/format.js';
import { element, button, emptyMessage } from '../components/dom.js';
import { createProductCard } from '../components/productCard.js';

initializeStore();
const state = { search: '', category: '', size: '', sort: 'recent', favorites: false };
let dialogId = null;

function message(text, ok = false) {
  const el = $('checkoutFeedback');
  el.textContent = text;
  el.classList.toggle('success', ok);
}

function addToCart(id) {
  const product = getProducts().find(p => p.id === id);
  if (!product || product.status !== 'disponivel' || product.stock_quantity < 1) return;
  const cart = getCart();
  const found = cart.find(item => item.id === id);
  if (found) {
    if (found.quantity >= product.stock_quantity) { openCart(); message('Você já selecionou todo o estoque disponível.'); return; }
    found.quantity += 1;
  } else { cart.push({ id, quantity: 1 }); }
  setCart(cart);
  renderCart();
  openCart();
}

function toggleFavorite(id) {
  const prev = getFavorites();
  setFavorites(prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  render();
}

function buildOptions() {
  $('categorySelect').append(...categories.map(c => element('option', { text: c.name, attrs: { value: c.id } })));
  // map, filter e Set aplicados a produtos efetivamente armazenados.
  const sizes = [...new Set(getProducts().map(p => p.size).filter(Boolean))].sort();
  const current = $('sizeSelect').value;
  $('sizeSelect').replaceChildren(element('option', { text: 'Todos os tamanhos', attrs: { value: '' } }), ...sizes.map(s => element('option', { text: s, attrs: { value: s } })));
  $('sizeSelect').value = sizes.includes(current) ? current : '';
}

function render() {
  const all = getProducts();
  const favorites = getFavorites();
  const visible = filterProducts(all, { ...state, favoriteIds: favorites });
  // map cria cada card manualmente usando document.createElement em productCard.js.
  $('productGrid').replaceChildren(...visible.map(p => createProductCard(p, { onAdd: addToCart, onFavorite: toggleFavorite, isFavorite: favorites.includes(p.id), onDetails: openDetails })));
  $('resultCount').textContent = `${visible.length} ${visible.length === 1 ? 'peça encontrada' : 'peças encontradas'}`;
  $('emptyState').hidden = !!visible.length;
  $('emptyState').replaceChildren(...(!visible.length ? [emptyMessage('Nenhuma peça encontrada. Experimente mudar os filtros.', 'Limpar filtros', clearFilters)] : []));
  $('favoriteCount').textContent = favorites.length;
  $('favoriteToggle').setAttribute('aria-pressed', String(state.favorites));
  $('favoriteToggle').classList.toggle('active', state.favorites);
  $('cartCount').textContent = getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function clearFilters() {
  Object.assign(state, { search: '', category: '', size: '', sort: 'recent', favorites: false });
  $('searchInput').value = '';
  $('categorySelect').value = '';
  $('sizeSelect').value = '';
  $('sortSelect').value = 'recent';
  render();
}

function openCart() {
  message('');
  $('cartDrawer').hidden = false;
  $('scrim').hidden = false;
  document.body.classList.add('lock-scroll');
  $('closeCart').focus();
}
function closeCart() {
  $('cartDrawer').hidden = true;
  $('scrim').hidden = true;
  document.body.classList.remove('lock-scroll');
  $('openCart').focus();
}
function changeQuantity(id, delta) {
  const cart = getCart();
  const row = cart.find(item => item.id === id);
  const product = getProducts().find(p => p.id === id);
  if (!row || !product) return;
  row.quantity = Math.min(product.stock_quantity, row.quantity + delta);
  if (row.quantity <= 0) setCart(cart.filter(x => x.id !== id));
  else setCart(cart);
  renderCart();
}
function removeFromCart(id) { setCart(getCart().filter(item => item.id !== id)); renderCart(); }

function renderCart() {
  const entries = cartEntries(getCart(), getProducts());
  if (!entries.length) {
    $('cartItems').replaceChildren(emptyMessage('Sua sacola está vazia. Descubra uma peça no catálogo!'));
  } else {
    $('cartItems').replaceChildren(...entries.map(item => {
      const row = element('div', { className: 'cart-row' });
      row.appendChild(element('img', { attrs: { src: item.image || './assets/logo.png', alt: item.name } }));
      const info = element('div', { className: 'cart-row-body' });
      info.appendChild(element('strong', { text: item.name }));
      info.appendChild(element('span', { className: 'subtle', text: money(item.price) }));
      const controls = element('div', { className: 'quantity-control' });
      controls.appendChild(button('−', () => changeQuantity(item.id, -1), 'tiny-btn', { 'aria-label': `Diminuir quantidade de ${item.name}` }));
      controls.appendChild(element('span', { text: item.quantity }));
      controls.appendChild(button('+', () => changeQuantity(item.id, 1), 'tiny-btn', { disabled: item.quantity >= item.stock_quantity ? '' : null, 'aria-label': `Aumentar quantidade de ${item.name}` }));
      info.appendChild(controls);
      info.appendChild(button('Remover', () => removeFromCart(item.id), 'remove-link'));
      row.appendChild(info);
      return row;
    }));
  }
  $('cartTotal').textContent = money(cartTotal(entries));
  $('checkoutButton').disabled = entries.length === 0;
  render();
}

function openDetails(id) {
  const p = getProducts().find(item => item.id === id);
  if (!p) return;
  dialogId = id;
  const box = $('productDialogContent');
  const image = element('img', { className: 'detail-image', attrs: { src: p.image || './assets/logo.png', alt: p.name } });
  const info = element('div', { className: 'detail-copy' }, [
    element('p', { className: 'kicker', text: 'PEÇA SELECIONADA' }),
    element('h2', { text: p.name }),
    element('p', { className: 'detail-price', text: money(p.price) }),
    element('p', { className: 'subtle', text: `${p.color || 'Cor não informada'} · Tamanho ${p.size || 'Único'}` }),
    element('p', { text: p.description || 'Mais uma peça com história.' }),
    button('Adicionar à sacola →', () => { $('productDialog').close(); addToCart(dialogId); }, 'submit-btn'),
  ]);
  box.replaceChildren(image, info);
  $('productDialog').showModal();
}

$('searchInput').addEventListener('input', e => { state.search = e.target.value; render(); });
$('categorySelect').addEventListener('change', e => { state.category = e.target.value; render(); });
$('sizeSelect').addEventListener('change', e => { state.size = e.target.value; render(); });
$('sortSelect').addEventListener('change', e => { state.sort = e.target.value; render(); });
$('favoriteToggle').addEventListener('click', () => { state.favorites = !state.favorites; render(); });
$('clearFilters').addEventListener('click', clearFilters);
$('openCart').addEventListener('click', () => { renderCart(); openCart(); });
$('closeCart').addEventListener('click', closeCart);
$('scrim').addEventListener('click', closeCart);
$('closeProductDialog').addEventListener('click', () => $('productDialog').close());
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('cartDrawer').hidden) closeCart(); });

$('checkoutForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('customerName').value.trim();
  const whatsapp = $('customerPhone').value.replace(/\D/g, '');
  if (name.length < 2 || name.length > 120) { message('Informe um nome válido.'); return; }
  if (whatsapp.length < 10 || whatsapp.length > 13) { message('Informe um WhatsApp válido com DDD.'); return; }
  const entries = cartEntries(getCart(), getProducts());
  try {
    const order = placeDemoOrder({ name, whatsapp, payment: $('paymentMethod').value, entries });
    $('checkoutForm').reset();
    renderCart();
    message(`Pedido demonstrativo #${order.number} criado! Você pode vê-lo na aba Pedidos do painel. Nenhuma mensagem foi enviada à loja.`, true);
  } catch (error) { message(error.message); renderCart(); }
});

window.addEventListener('storage', () => { buildOptions(); renderCart(); });
buildOptions();
renderCart();
